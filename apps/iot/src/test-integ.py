import os
import sys
import time
import json
import random
import cv2
import numpy as np
import pigpio
import asyncio
from datetime import datetime, timezone
from ultralytics import YOLO
from dotenv import load_dotenv
from sonic import measure_distance
from bat import get_battery_status
import argparse

# ---------------- ENVIRONMENT ----------------
load_dotenv("/home/kalabaw/yolo/.env")
load_dotenv("/home/kalabaw/yolo/binspire-iot/.env")
sys.path.append(os.path.join(os.path.dirname(__file__), "binspire-iot", "src"))
from lib.mqtt_client import MQTTClient
from lib.supabase import upload_detection_image

# ---------------- SERVO CONFIG ----------------
SERVO_PIN = 18
MIN_PULSE, MAX_PULSE = 700, 2300
SERVO_OPEN, SERVO_CLOSE = 0, 125
OPEN_TIME = 5
COOLDOWN = 5

# ---------------- MQTT ----------------
mqtt = MQTTClient(client_id="yolo_detector")

# ---------------- PIGPIO ----------------
pi = pigpio.pi()
if not pi.connected:
    print("ERROR: Start pigpio with 'sudo pigpiod'")
    sys.exit(1)


def set_servo(angle):
    angle = max(0, min(180, angle))
    pulse = MIN_PULSE + (angle / 180.0) * (MAX_PULSE - MIN_PULSE)
    pi.set_servo_pulsewidth(SERVO_PIN, pulse)


def move_servo(start, end, step=10, delay=0.02):
    angles = np.arange(
        start, end + step if start < end else end - step, step if start < end else -step
    )
    for angle in angles:
        set_servo(int(angle))
        time.sleep(delay)
    set_servo(int(end))


async def open_lid():
    print("[SERVO] Opening lid")
    await asyncio.to_thread(move_servo, SERVO_CLOSE, SERVO_OPEN)


async def close_lid():
    print("[SERVO] Closing lid")
    await asyncio.to_thread(move_servo, SERVO_OPEN, SERVO_CLOSE)
    hold_pulse = MIN_PULSE + (SERVO_CLOSE / 180.0) * (MAX_PULSE - MIN_PULSE)
    pi.set_servo_pulsewidth(hold_pulse)
    print("[SERVO] Lid closed")


async def publish_server_status(status: str):
    """Publish server status using the persistent MQTT client"""
    try:
        mqtt.publish("server/status", json.dumps({"server": status}))
    except Exception as e:
        print(f"[ERROR] Server status failed: {e}")


async def periodic_server_status(interval=60):
    while True:
        await publish_server_status("online")
        await asyncio.sleep(interval)


# ---------------- ARGUMENTS ----------------
parser = argparse.ArgumentParser()
parser.add_argument("--model", required=True)
parser.add_argument("--source", required=True)
parser.add_argument("--resolution", default="640x480")
parser.add_argument("--thresh", type=float, default=0.5)
parser.add_argument("--headless", action="store_true")
args = parser.parse_args()

resW, resH = map(int, args.resolution.split("x"))


# ---------------- CAMERA ----------------
async def init_camera():
    global get_frame, cam
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
        await asyncio.sleep(2)
        get_frame = lambda: cv2.cvtColor(cam.capture_array(), cv2.COLOR_BGRA2BGR)
    elif "usb" in args.source:
        idx = int(args.source[3:])
        cam = cv2.VideoCapture(idx)
        cam.set(3, resW)
        cam.set(4, resH)
        get_frame = lambda: cam.read()[1]
    else:
        print("Unsupported source. Use 'picamera0' or 'usb0'")
        sys.exit(1)


# ---------------- YOLO MODEL ----------------
model = YOLO(args.model)
labels = model.names
print(f"[INFO] Model loaded: {args.model}")

# ---------------- MAIN TASKS ----------------
lid_open = False
last_detection_time = 0
lid_timer_start = None
last_measure_time = 0
MEASURE_INTERVAL = 30


async def yolo_detection_loop():
    global lid_open, last_detection_time, lid_timer_start
    while True:
        frame = get_frame()
        if frame is None:
            await asyncio.sleep(0.5)
            continue

        now = time.time()
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

        if object_found and (now - last_detection_time > COOLDOWN) and not lid_open:
            last_detection_time = now
            lid_open = True
            lid_timer_start = now
            await open_lid()
            _, buffer = cv2.imencode(".jpg", frame)
            url = upload_detection_image(
                buffer.tobytes(), classname, conf, datetime.now().isoformat()
            )
            data = {
                "class": classname,
                "confidence": round(conf, 2),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "imageUrl": url,
            }
            mqtt.publish("trashbin/EN7MIZC5jw_CJHPzffRRV/detections", json.dumps(data))
            print(f"[MQTT] Published detection: {data}")

        if lid_open and lid_timer_start and (now - lid_timer_start > OPEN_TIME):
            await close_lid()
            lid_open = False
            lid_timer_start = None

        if not args.headless:
            cv2.imshow("YOLO Detection", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
        await asyncio.sleep(0.01)


async def sensor_loop():
    global last_measure_time
    while True:
        now = time.time()
        if now - last_measure_time > MEASURE_INTERVAL:
            last_measure_time = now
            weight_level = round(random.uniform(0, 30), 2)
            dist = measure_distance()
            if dist is not None:
                mqtt.publish(
                    "trashbin/EN7MIZC5jw_CJHPzffRRV/waste_level",
                    json.dumps(
                        {
                            "wasteLevel": round(dist, 2),
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        }
                    ),
                )
                mqtt.publish(
                    "trashbin/EN7MIZC5jw_CJHPzffRRV/weight_level",
                    json.dumps(
                        {
                            "weightLevel": weight_level,
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        }
                    ),
                )
                print(f"[ULTRASONIC] Level: {dist:.2f} cm, Weight: {weight_level}")
            else:
                print("[ULTRASONIC] No reading")

            battery = get_battery_status()
            mqtt.publish(
                "trashbin/EN7MIZC5jw_CJHPzffRRV/battery_level",
                json.dumps(
                    {
                        "voltage": battery["voltage"],
                        "current_mA": battery["current"],
                        "power_W": battery["power"],
                        "batteryLevel": battery["percent"],
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    }
                ),
            )
            print(f"[BATTERY] {battery}")
        await asyncio.sleep(1)


async def main():
    mqtt.connect()  # Connect once
    print("[INFO] MQTT connected")
    await publish_server_status("online")
    await init_camera()
    await asyncio.gather(
        periodic_server_status(interval=60),
        yolo_detection_loop(),
        sensor_loop(),
    )


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("[INFO] Interrupted by user")
    finally:
        pi.set_servo_pulsewidth(SERVO_PIN, 0)
        mqtt.disconnect()
        asyncio.run(publish_server_status("offline"))
        if "usb" in args.source:
            cam.release()
        elif "picamera" in args.source:
            cam.stop()
        cv2.destroyAllWindows()
        print("[INFO] Shutdown complete.")
