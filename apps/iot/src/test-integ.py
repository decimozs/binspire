import os
import sys
import time
import json
import cv2
import numpy as np
import pigpio
from datetime import datetime
from ultralytics import YOLO
from dotenv import load_dotenv
from lib.servo_motor import measure_distance
from lib.mqtt_client import MQTTClient
from lib.supabase import upload_detection_image
from lib.battery import get_battery_status
from lib.db import Database

# ---------------- ENVIRONMENT SETUP ----------------
load_dotenv("/home/kalabaw/yolo/.env")
load_dotenv("/home/kalabaw/yolo/binspire-iot/.env")

BATTERY_CRITICAL_THRESHOLD = 10
BATTERY_LOW_THRESHOLD = 30

status_topic = f"trashbin/{id}/status"
detections_topic = "trashbin/detections"
alert_topic = f"trashbin/{id}/alerts"

sys.path.append(os.path.join(os.path.dirname(__file__), "binspire-iot", "src"))

# ---------------- SERVO CONFIG ----------------
SERVO_PIN = 18
MIN_PULSE, MAX_PULSE = 700, 2300
SERVO_OPEN, SERVO_CLOSE = 0, 125
OPEN_TIME = 5  # seconds lid stays open
COOLDOWN = 5  # seconds between detections

db = Database()

if not db.pool:
    raise RuntimeError("Database connection is not established.")

if id is None:
    raise ValueError("Trashbin ID cannot be None.")


pi = pigpio.pi()

if not pi.connected:
    print("ERROR: Start pigpio with 'sudo pigpiod'")
    sys.exit(1)


def set_servo(angle):
    angle = max(0, min(180, angle))
    pulse = MIN_PULSE + (angle / 180.0) * (MAX_PULSE - MIN_PULSE)
    pi.set_servo_pulsewidth(SERVO_PIN, pulse)


def move_servo(start, end, step=10, delay=0.02):
    if start < end:
        angles = np.arange(start, end + step, step)
    else:
        angles = np.arange(start, end - step, -step)
    for angle in angles:
        set_servo(int(angle))
        time.sleep(delay)
    set_servo(int(end))


def open_lid():
    print("[SERVO] Opening lid")
    move_servo(SERVO_CLOSE, SERVO_OPEN)


def close_lid():
    print("[SERVO] Closing lid")
    move_servo(SERVO_OPEN, SERVO_CLOSE)
    hold_pulse = MIN_PULSE + (SERVO_CLOSE / 180.0) * (MAX_PULSE - MIN_PULSE)
    pi.set_servo_pulsewidth(SERVO_PIN, hold_pulse)
    print("[SERVO] Lid closed")


# ---------------- ARGUMENTS ----------------
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--model", required=True)
parser.add_argument("--source", required=True)
parser.add_argument("--resolution", default="640x480")
parser.add_argument("--thresh", type=float, default=0.5)
parser.add_argument("--headless", action="store_true")
args = parser.parse_args()

# ---------------- YOLO MODEL ----------------
model = YOLO(args.model)
labels = model.names
print(f"[INFO] Model loaded: {args.model}")

# ---------------- MQTT SETUP ----------------
mqtt = MQTTClient(client_id="yolo_detector")
mqtt.connect()
print("[INFO] MQTT connected")

# ---------------- CAMERA SOURCE ----------------
resW, resH = map(int, args.resolution.split("x"))

if "picamera" in args.source:
    from picamera2 import Picamera2
    from libcamera import Transform

    cam = Picamera2()
    cam.configure(
        cam.create_video_configuration(
            main={"format": "XRGB8888", "size": (resW, resH)},
            transform=Transform(vflip=1),
        )
    )
    cam.start()
    time.sleep(2)
    get_frame = lambda: cv2.cvtColor(cam.capture_array(), cv2.COLOR_BGRA2BGR)

elif "usb" in args.source:
    idx = int(args.source[3:])
    cap = cv2.VideoCapture(idx)
    cap.set(3, resW)
    cap.set(4, resH)
    get_frame = lambda: cap.read()[1]

else:
    print("Unsupported source. Use 'picamera0' or 'usb0'")
    sys.exit(1)

# ---------------- MAIN LOOP ----------------
lid_open = False
last_detection_time = 0
lid_timer_start = None

last_measure_time = 0
MEASURE_INTERVAL = 30  # seconds for ultrasonic + battery

close_lid()
print("[INFO] Continuous detection loop started...")

try:
    while True:
        frame = get_frame()
        if frame is None:
            time.sleep(0.5)
            continue

        now = time.time()

        # --- YOLO DETECTION ---
        results = model(frame, verbose=False)
        detections = results[0].boxes
        object_found = False
        classname, conf = None, 0

        for det in detections:
            conf = det.conf.item()
            if conf < args.thresh:
                continue
            classname = labels[int(det.cls.item())]
            object_found = True
            break

        # --- LID CONTROL ---
        if object_found and (now - last_detection_time > COOLDOWN) and not lid_open:
            last_detection_time = now
            lid_open = True
            lid_timer_start = now
            open_lid()

            data = {
                "bin_id": "EN7MIZC5jw_CJHPzffRRV",
                "event": "object_detected",
                "class": classname,
                "confidence": round(conf, 2),
                "timestamp": datetime.now().isoformat(),
            }
            mqtt.publish("trashbin/EN7MIZC5jw_CJHPzffRRV/detections", json.dumps(data))
            print(f"[MQTT] Published: {data}")

            _, buffer = cv2.imencode(".jpg", frame)
            url = upload_detection_image(
                buffer.tobytes(), classname, conf, data["timestamp"]
            )
            print("[SUPABASE]", "Upload success" if url else "Upload failed")

        if lid_open and lid_timer_start and (now - lid_timer_start > OPEN_TIME):
            close_lid()
            lid_open = False
            lid_timer_start = None

        # --- ULTRASONIC + BATTERY EVERY 30 SECONDS ---
        if now - last_measure_time > MEASURE_INTERVAL:
            last_measure_time = now

            # Ultrasonic
            dist = measure_distance()
            if dist is not None:
                print(f"[ULTRASONIC] Current level: {dist:.2f} cm")
                mqtt.publish(
                    "trashbin/EN7MIZC5jw_CJHPzffRRV/status",
                    json.dumps(
                        {
                            "bin_id": "EN7MIZC5jw_CJHPzffRRV",
                            "event": "distance_check",
                            "distance_cm": round(dist, 2),
                            "timestamp": datetime.now().isoformat(),
                        }
                    ),
                )
            else:
                print("[ULTRASONIC] No reading")

            # Battery
            battery = (
                get_battery_status()
            )  # should return dict with voltage/current/power
            mqtt.publish(
                "trashbin/EN7MIZC5jw_CJHPzffRRV/battery",
                json.dumps(
                    {
                        "voltage": battery["voltage"],
                        "current_mA": battery["current"],
                        "power_W": battery["power"],
                        "timestamp": datetime.now().isoformat(),
                    }
                ),
            )
            print(f"[BATTERY] {battery}")

        # --- DISPLAY ---
        if not args.headless:
            cv2.imshow("YOLO Detection", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

except KeyboardInterrupt:
    print("\n[INFO] Interrupted by user")

finally:
    print("[INFO] Cleaning up...")
    pi.set_servo_pulsewidth(SERVO_PIN, 0)
    mqtt.disconnect()
    if "usb" in args.source:
        cap.release()
    elif "picamera" in args.source:
        cam.stop()
    cv2.destroyAllWindows()
    print("[INFO] Shutdown complete.")
