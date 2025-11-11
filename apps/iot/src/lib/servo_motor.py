import time
import numpy as np
import pigpio


class ServoMotor:
    def __init__(
        self,
        pin: int = 18,
        min_pulse: int = 700,
        max_pulse: int = 2300,
        angle_open: int = 0,
        angle_close: int = 125,
    ):
        self.pin = pin
        self.min_pulse = min_pulse
        self.max_pulse = max_pulse
        self.angle_open = angle_open
        self.angle_close = angle_close

        self.pi = pigpio.pi()
        if not self.pi.connected:
            raise RuntimeError(
                "ERROR: Start pigpio daemon with 'sudo pigpiod' before running."
            )

        self.set_angle(self.angle_close)
        print(f"[SERVO] Initialized on GPIO {self.pin}")

    def _angle_to_pulse(self, angle: int) -> int:
        """Convert angle (0–180) to servo pulse width (μs)."""
        angle = max(0, min(180, angle))
        return int(self.min_pulse + (angle / 180.0) * (self.max_pulse - self.min_pulse))

    def set_angle(self, angle: int):
        """Set the servo to a specific angle."""
        pulse = self._angle_to_pulse(angle)
        self.pi.set_servo_pulsewidth(self.pin, pulse)

    def move(self, start: int, end: int, step: int = 10, delay: float = 0.02):
        """Smoothly move the servo from one angle to another."""
        if start < end:
            angles = np.arange(start, end + step, step)
        else:
            angles = np.arange(start, end - step, -step)

        for angle in angles:
            self.set_angle(int(angle))
            time.sleep(delay)

        self.set_angle(int(end))

    def open(self):
        """Open the servo lid."""
        print("[SERVO] Opening lid")
        self.move(self.angle_close, self.angle_open)

    def close(self):
        """Close the servo lid."""
        print("[SERVO] Closing lid")
        self.move(self.angle_open, self.angle_close)
        hold_pulse = self._angle_to_pulse(self.angle_close)
        self.pi.set_servo_pulsewidth(self.pin, hold_pulse)
        print("[SERVO] Lid closed")

    def stop(self):
        """Stop the servo signal (useful during shutdown)."""
        self.pi.set_servo_pulsewidth(self.pin, 0)

    def cleanup(self):
        """Release pigpio resources."""
        self.stop()
        self.pi.stop()
        print("[SERVO] Cleaned up and stopped.")


if __name__ == "__main__":
    servo = ServoMotor()
    try:
        servo.open()
        time.sleep(2)
        servo.close()
    except KeyboardInterrupt:
        pass
    finally:
        servo.cleanup()
