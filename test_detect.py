import cv2
from deepface import DeepFace

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    try:
        faces = DeepFace.extract_faces(
            img_path=frame,
            detector_backend="opencv",  # simplest + most stable
            enforce_detection=False
        )

        print("Faces detected:", len(faces))

    except Exception as e:
        print("Error:", e)

    cv2.imshow("Test", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()