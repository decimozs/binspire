import cv2
import time


class Camera:
    def __init__(self, source: str, resolution: str = "640x480"):
        """
        Initialize the camera source (PiCamera or USB).

        :param source: Camera source, e.g. 'picamera0' or 'usb0'.
        :param resolution: Resolution string like '640x480'.
        """
        self.source = source
        self.resW, self.resH = map(int, resolution.split("x"))
        self.cam = None
        self.cap = None
        self._setup_camera()

    def _setup_camera(self):
        """Setup camera based on source type."""
        if "picamera" in self.source:
            from picamera2 import Picamera2
            from libcamera import Transform

            self.cam = Picamera2()
            self.cam.configure(
                self.cam.create_video_configuration(
                    main={"format": "XRGB8888", "size": (self.resW, self.resH)},
                    transform=Transform(vflip=1),
                )
            )
            self.cam.start()
            time.sleep(2)
            self.get_frame = lambda: cv2.cvtColor(
                self.cam.capture_array(), cv2.COLOR_BGRA2BGR
            )
            print(f"[CAMERA] PiCamera initialized ({self.resW}x{self.resH})")

        elif "usb" in self.source:
            idx = int(self.source[3:])
            self.cap = cv2.VideoCapture(idx)
            self.cap.set(3, self.resW)
            self.cap.set(4, self.resH)
            self.get_frame = lambda: self.cap.read()[1]
            print(f"[CAMERA] USB Camera initialized ({self.resW}x{self.resH})")

        else:
            raise ValueError("Unsupported camera source. Use 'picamera0' or 'usb0'.")

    def release(self):
        """Release camera resources."""
        if self.cap:
            self.cap.release()
        elif self.cam:
            self.cam.stop()
        print("[CAMERA] Released camera resources.")
