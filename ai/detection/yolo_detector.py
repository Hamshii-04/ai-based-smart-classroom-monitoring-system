from ultralytics import YOLO

class YOLODetector:
    def __init__(self):
        self.model = YOLO("yolov8n.pt")  # auto-downloads

    def detect(self, frame):
        results = self.model(frame, verbose=False)

        boxes = []
        for r in results:
            for b in r.boxes:
                x1, y1, x2, y2 = map(int, b.xyxy[0])
                boxes.append((x1, y1, x2, y2))

        return boxes