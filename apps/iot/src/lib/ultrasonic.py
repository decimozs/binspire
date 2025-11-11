import RPi.GPIO as GPIO
import time


class UltrasonicSensor:
    def __init__(self, trigger_pin: int = 23, echo_pin: int = 24, timeout: float = 1.0):
        self.trigger_pin = trigger_pin
        self.echo_pin = echo_pin
        self.timeout = timeout

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.trigger_pin, GPIO.OUT)
        GPIO.setup(self.echo_pin, GPIO.IN)
        GPIO.output(self.trigger_pin, False)

        time.sleep(0.5)

    def measure_distance(self) -> float | None:
        GPIO.output(self.trigger_pin, True)
        time.sleep(0.00001)
        GPIO.output(self.trigger_pin, False)

        start_time = time.time()
        stop_time = time.time()

        timeout_start = time.time()
        while GPIO.input(self.echo_pin) == 0:
            start_time = time.time()
            if start_time - timeout_start > self.timeout:
                return None

        timeout_start = time.time()
        while GPIO.input(self.echo_pin) == 1:
            stop_time = time.time()
            if stop_time - timeout_start > self.timeout:
                return None

        time_elapsed = stop_time - start_time
        distance = (time_elapsed * 34300) / 2
        return distance

    def cleanup(self):
        """Clean up GPIO pins."""
        GPIO.cleanup()


if __name__ == "__main__":
    sensor = UltrasonicSensor(trigger_pin=23, echo_pin=24)

    try:
        while True:
            distance = sensor.measure_distance()
            if distance is None:
                print("Out of range or no object detected")
            else:
                print(f"Measured Distance = {distance:.2f} cm")
            time.sleep(1)
    except KeyboardInterrupt:
        print("Measurement stopped by user")
    finally:
        sensor.cleanup()
