import cv2
from deepface import DeepFace
import os
import numpy as np
import csv
from datetime import datetime
import uuid

# -------- SETTINGS --------
DB_PATH = "backend/Database"
THRESHOLD = 0.6
RECOG_INTERVAL = 10

# -------- LOAD DATABASE --------
database = {}

for person in os.listdir(DB_PATH):
    person_path = os.path.join(DB_PATH, person)
    if not os.path.isdir(person_path):
        continue

    embs = []
    for img in os.listdir(person_path):
        p = os.path.join(person_path, img)
        try:
            e = DeepFace.represent(
                img_path=p,
                model_name="Facenet512",
                enforce_detection=False
            )[0]["embedding"]
            embs.append(e)
        except:
            pass

    if embs:
        database[person] = np.mean(embs, axis=0)

print("Database:", list(database.keys()))

# -------- ATTENDANCE --------
def mark_attendance(name):
    file = "attendance.csv"
    time = datetime.now().strftime("%H:%M:%S")

    if os.path.exists(file):
        with open(file, "r") as f:
            if name in f.read():
                return

    with open(file, "a", newline="") as f:
        csv.writer(f).writerow([name, time])

# -------- SIMILARITY --------
def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# -------- IOU (TRACKING) --------
from deep_sort_realtime.deepsort_tracker import DeepSort

tracker = DeepSort(max_age=30)

# inside loop
detections = []

for face in faces:
    x, y, w, h = ...
    detections.append(([x, y, w, h], 1.0, 'face'))

tracks = tracker.update_tracks(detections, frame=frame)

for track in tracks:
    if not track.is_confirmed():
        continue

    track_id = track.track_id
    l, t, w, h = track.to_ltrb()

    cv2.rectangle(frame, (int(l), int(t)), (int(l+w), int(t+h)), (0,255,0), 2)
# -------- CAMERA --------
cap = cv2.VideoCapture(0)
frame_count = 0

tracks = {}  # id -> {box, name}

print("Press Q to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (640, 480))
    frame_count += 1

    try:
        detections = DeepFace.extract_faces(
            img_path=frame,
            detector_backend="opencv",
            enforce_detection=False
        )

        new_tracks = {}

        for face in detections:
            area = face["facial_area"]
            box = (area["x"], area["y"], area["w"], area["h"])

            # -------- MATCH WITH EXISTING TRACK --------
            matched_id = None

            for tid, tdata in tracks.items():
                if iou(box, tdata["box"]) > 0.4:
                    matched_id = tid
                    break

            if matched_id is None:
                matched_id = str(uuid.uuid4())

            name = tracks.get(matched_id, {}).get("name", "Detecting...")

            # -------- RECOGNITION --------
            if frame_count % RECOG_INTERVAL == 0:
                x, y, w, h = box
                face_img = frame[y:y+h, x:x+w]

                try:
                    emb = DeepFace.represent(
                        img_path=face_img,
                        model_name="Facenet512",
                        enforce_detection=False
                    )[0]["embedding"]

                    best_name = "Unknown"
                    best_score = -1

                    for person, db_emb in database.items():
                        score = cosine(emb, db_emb)

                        if score > best_score:
                            best_score = score
                            best_name = person

                    if best_score > THRESHOLD:
                        name = best_name
                        mark_attendance(name)
                    else:
                        name = "Unknown"

                except:
                    pass

            new_tracks[matched_id] = {"box": box, "name": name}

            # DRAW
            x, y, w, h = box
            cv2.rectangle(frame, (x,y), (x+w,y+h), (0,255,0), 2)
            cv2.putText(frame, name, (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

        tracks = new_tracks

    except:
        pass

    cv2.imshow("Production Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()