import os
import sys
import json
import glob
import time
import cv2
import numpy as np
import pigpio
import logging
from datetime import datetime
from ultralytics import YOLO
from dotenv import load_dotenv

# ---------------- UTF-8 FIX ----------------
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

for handler in logging.root.handlers:
    if hasattr(handler.stream, "reconfigure"):
        try:
            handler.stream.reconfigure(encoding="utf-8")
        except Exception:
            pass
# ------------------------------------------------------

# ---------------- ENVIRONMENT SETUP ----------------
load_dotenv("/home/kalabaw/yolo/.env")
load_dotenv("/home/kalabaw/yolo/binspire-iot/.env")

print("[INFO] Environment variables loaded successfully.")

# Extend sys.path to include IoT source folder
sys.path.append(os.path.join(os.path.dirname(__file__), "binspire-iot", "src"))

from lib.mqtt_client import MQTTClient
from lib.supabase import upload_detection_image

# ---------------- SERVO SETUP ----------------
SERVO_PIN = 18
SERVO_OPEN = 0  # Degrees to open lid
SERVO_CLOSE = 90  # Degrees to close lid
OPEN_TIME = 10  # Seconds to keep lid open

pi = pigpio.pi()
if not pi.connected:
    print("ERROR: Cannot connect to pigpio daemon. Run 'sudo pigpiod' first.")
    sys.exit(0)


def set_servo_angle(angle):
    angle = max(0, min(180, angle))
    pulse = 500 + (angle / 180.0) * 2000
    pi.set_servo_pulsewidth(SERVO_PIN, pulse)
    return pulse


def open_lid():
    print("Opening lid...")
    pulse = set_servo_angle(SERVO_OPEN)
    print(f"Servo pulse: {pulse} µs")
    time.sleep(OPEN_TIME)
    time.sleep(1)
    close_lid()


def close_lid():
    print("Closing lid...")
    pulse = set_servo_angle(SERVO_CLOSE)
    print(f"Servo pulse: {pulse} µs")
    time.sleep(0.5)


# ---------------- ARGUMENT PARSER ----------------
import argparse

parser = argparse.ArgumentParser()
parser.add_argument(
    "--model", required=True, help="Path to YOLO model file (e.g., my_model.pt)"
)
parser.add_argument(
    "--source", required=True, help="Source: picamera0, usb0, video.mp4, folder/"
)
parser.add_argument("--thresh", default=0.5, type=float, help="Confidence threshold")
parser.add_argument("--headless", action="store_true", help="Run without GUI window")
parser.add_argument(
    "--resolution", default=None, help="Resolution WxH (e.g., 1280x720)"
)
parser.add_argument(
    "--record", action="store_true", help="Record detection video output"
)
args = parser.parse_args()

# ---------------- MODEL LOADING ----------------
model_path = args.model
if not os.path.exists(model_path):
    print("ERROR: Model path is invalid.")
    sys.exit(0)

model = YOLO(model_path, task="detect")
labels = model.names
print(f"[INFO] YOLO model loaded: {model_path}")

# ---------------- MQTT CLIENT ----------------
mqtt_client = MQTTClient(client_id="yolo_detector")
mqtt_client.connect()
print("[INFO] MQTT client connected.")

# ---------------- SOURCE SETUP ----------------
img_source = args.source
img_ext_list = [".jpg", ".jpeg", ".png", ".bmp"]
vid_ext_list = [".avi", ".mov", ".mp4", ".mkv", ".wmv"]

if os.path.isdir(img_source):
    source_type = "folder"
elif os.path.isfile(img_source):
    _, ext = os.path.splitext(img_source)
    if ext in img_ext_list:
        source_type = "image"
    elif ext in vid_ext_list:
        source_type = "video"
    else:
        print(f"Unsupported file extension: {ext}")
        sys.exit(0)
elif "usb" in img_source:
    source_type = "usb"
    usb_idx = int(img_source[3:])
elif "picamera" in img_source:
    source_type = "picamera"
    picam_idx = int(img_source[8:])
else:
    print(f"Invalid source: {img_source}")
    sys.exit(0)

# Resolution setup
resize = False
if args.resolution:
    resize = True
    resW, resH = map(int, args.resolution.split("x"))
else:
    resW, resH = 640, 480  # Default resolution

# Recorder setup
if args.record:
    if source_type not in ["video", "usb"]:
        print("Recording only works for video or USB camera sources.")
        sys.exit(0)
    if not args.resolution:
        print("Please specify resolution for recording.")
        sys.exit(0)
    recorder = cv2.VideoWriter(
        "detections_record.avi", cv2.VideoWriter_fourcc(*"MJPG"), 30, (resW, resH)
    )

# Capture setup
if source_type == "image":
    imgs_list = [img_source]
elif source_type == "folder":
    imgs_list = [
        f
        for f in glob.glob(img_source + "/*")
        if os.path.splitext(f)[1] in img_ext_list
    ]
elif source_type in ["video", "usb"]:
    cap = cv2.VideoCapture(img_source if source_type == "video" else usb_idx)
    if resize:
        cap.set(3, resW)
        cap.set(4, resH)
elif source_type == "picamera":
    from picamera2 import Picamera2
    from libcamera import Transform

    print("[INFO] Initializing Picamera2...")
    cap = Picamera2()

    try:
        video_config = cap.create_video_configuration(
            main={"format": "XRGB8888", "size": (resW, resH)},
            transform=Transform(vflip=1, hflip=0),
        )
        cap.configure(video_config)
        cap.start()
        time.sleep(2)
        print("[INFO] Picamera2 is now streaming.")
    except Exception as e:
        print(f"[ERROR] Failed to initialize Picamera2: {e}")
        sys.exit(1)

# ---------------- DETECTION LOOP ----------------
bbox_colors = [
    (164, 120, 87),
    (68, 148, 228),
    (93, 97, 209),
    (178, 182, 133),
    (88, 159, 106),
    (96, 202, 231),
    (159, 124, 168),
    (169, 162, 241),
    (98, 118, 150),
    (172, 176, 184),
]

avg_frame_rate = 0
frame_rate_buffer = []
fps_avg_len = 200
img_count = 0
lid_opened = False
last_open_time = 0

classname, conf = None, 0

print("[INFO] Detection loop started. Press 'q' to exit.")

while True:
    t_start = time.perf_counter()

    # Frame capture
    if source_type in ["image", "folder"]:
        if img_count >= len(imgs_list):
            print("All images processed. Exiting.")
            break
        frame = cv2.imread(imgs_list[img_count])
        img_count += 1
    elif source_type in ["video", "usb"]:
        ret, frame = cap.read()
        if not ret:
            print("Video/camera ended or disconnected.")
            break
    elif source_type == "picamera":
        frame_bgra = cap.capture_array()
        if frame_bgra is None or frame_bgra.size == 0:
            print("[WARN] No frame received from camera.")
            time.sleep(1)
            continue
        frame = cv2.cvtColor(np.copy(frame_bgra), cv2.COLOR_BGRA2BGR)

    if resize:
        frame = cv2.resize(frame, (resW, resH))

    # YOLO detection
    results = model(frame, verbose=False)
    detections = results[0].boxes

    object_detected = False
    for det in detections:
        conf = det.conf.item()
        if conf < args.thresh:
            continue
        xyxy = det.xyxy.cpu().numpy().squeeze().astype(int)
        xmin, ymin, xmax, ymax = xyxy
        classidx = int(det.cls.item())
        classname = labels[classidx]
        color = bbox_colors[classidx % 10]
        cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), color, 2)
        label = f"{classname}: {int(conf * 100)}%"
        cv2.putText(
            frame, label, (xmin, ymin - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2
        )
        object_detected = True

    # Handle detection event
    if object_detected and not lid_opened:
        open_lid()
        lid_opened = True
        last_open_time = time.time()

        data = {
            "bin_id": "EN7MIZC5jw_CJHPzffRRV",
            "event": "object_detected",
            "class": classname,
            "confidence": round(conf, 2),
            "timestamp": datetime.now().isoformat(),
        }
        mqtt_client.publish("trashbin/detections", json.dumps(data))
        print(f"MQTT published: {data}")

        # Encode image to bytes and upload directly
        _, buffer = cv2.imencode(".jpg", frame)
        image_bytes = buffer.tobytes()

        # Upload to Supabase
        image_url = upload_detection_image(
            image_bytes, classname, conf, datetime.now().isoformat()
        )
        if image_url:
            print("Supabase upload success:", image_url)
        else:
            print("Supabase upload failed")

    elif lid_opened and time.time() - last_open_time > OPEN_TIME + 2:
        lid_opened = False

    # Display window
    if not args.headless:
        cv2.imshow("YOLO Detection", frame)

    if args.record:
        recorder.write(frame)

    key = cv2.waitKey(1)
    if key == ord("q"):
        break
    elif key == ord("p"):
        cv2.imwrite("capture.png", frame)

    # FPS
    t_stop = time.perf_counter()
    frame_rate_calc = float(1 / (t_stop - t_start))
    frame_rate_buffer.append(frame_rate_calc)
    if len(frame_rate_buffer) > fps_avg_len:
        frame_rate_buffer.pop(0)
    avg_frame_rate = np.mean(frame_rate_buffer)

# ---------------- CLEANUP ----------------
print(f"Average FPS: {avg_frame_rate:.2f}")
pi.set_servo_pulsewidth(SERVO_PIN, 0)
if source_type in ["video", "usb"]:
    cap.release()
elif source_type == "picamera":
    cap.stop()
if args.record:
    recorder.release()
mqtt_client.disconnect()
cv2.destroyAllWindows()
print("[INFO] Shutdown complete.")
