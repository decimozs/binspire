from ultralytics import YOLO


class YoloDetector:
    def __init__(self, model_path: str, conf_thresh: float = 0.5):
        """
        Initialize YOLOv8 detector.

        :param model_path: Path to the YOLO model (.pt file)
        :param conf_thresh: Minimum confidence threshold for detections
        """
        self.model = YOLO(model_path)
        self.labels = self.model.names
        self.conf_thresh = conf_thresh
        print(f"[YOLO] Model loaded: {model_path}")

    def detect(self, frame):
        """
        Run YOLO detection on a frame.

        :param frame: OpenCV BGR image
        :return: (object_found, classname, confidence)
        """
        results = self.model(frame, verbose=False)
        detections = results[0].boxes
        for det in detections:
            conf = det.conf.item()
            if conf < self.conf_thresh:
                continue
            classname = self.labels[int(det.cls.item())]
            return True, classname, conf
        return False, None, 0.0
