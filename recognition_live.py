import cv2
from ai.detection.simple_detector import SimpleDetector

detector = SimpleDetector()

cap = cv2.VideoCapture(0)

print("Press Q to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    boxes = detector.detect(frame)

    for (x1, y1, x2, y2) in boxes:

        cv2.rectangle(frame, (x1,y1), (x2,y2), (0,255,0), 2)
        cv2.putText(frame, "Face", (x1,y1-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0), 2)

    cv2.imshow("Smart Classroom AI", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()