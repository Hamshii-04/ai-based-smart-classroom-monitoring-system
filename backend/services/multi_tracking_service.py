import cv2
import base64
import numpy as np

from ultralytics import YOLO

from services.face_service import (
    database,
    cosine,
    MODEL_NAME,
    THRESHOLD
)

from deepface import DeepFace

from services.phone_service import (
    detect_phone
)

from services.attention_service import (
    detect_attention
)

# LOAD YOLO MODEL

face_model = YOLO("yolov8n.pt")


def detect_multiple_faces(image_base64):

    try:

        # BASE64 → IMAGE

        img_data = base64.b64decode(
            image_base64.split(",")[1]
        )

        np_arr = np.frombuffer(
            img_data,
            np.uint8
        )

        frame = cv2.imdecode(
            np_arr,
            cv2.IMREAD_COLOR
        )

        # YOLO DETECTION

        results = face_model(frame)

        detected_students = []

        for result in results:

            boxes = result.boxes

            for box in boxes:

                x1, y1, x2, y2 = map(
                    int,
                    box.xyxy[0]
                )

                confidence = float(
                    box.conf[0]
                )

                # SKIP LOW CONFIDENCE

                if confidence < 0.4:
                    continue

                # CROP FACE

                face_crop = frame[
                    y1:y2,
                    x1:x2
                ]

                if face_crop.size == 0:
                    continue

                temp_path = "temp_face.jpg"

                cv2.imwrite(
                    temp_path,
                    face_crop
                )

                try:

                    # FACE EMBEDDING

                    emb = DeepFace.represent(

                        img_path=temp_path,

                        model_name=MODEL_NAME,

                        enforce_detection=False,

                        align=False

                    )[0]["embedding"]

                    best_name = "Unknown"

                    best_score = 0

                    # DATABASE COMPARISON

                    for person, db_emb in database.items():

                        score = cosine(
                            emb,
                            db_emb
                        )

                        if score > best_score:

                            best_score = score

                            best_name = person

                    confidence_score = round(
                        best_score * 100,
                        2
                    )

                    # THRESHOLD CHECK

                    if best_score < THRESHOLD:

                        best_name = "Unknown"

                    # SAVE STUDENT

                    detected_students.append({

                        "name": best_name,

                        "score": confidence_score,

                        "box": {

                            "x": x1,

                            "y": y1,

                            "w": x2 - x1,

                            "h": y2 - y1

                        }

                    })

                except Exception as e:

                    print(
                        "Recognition Error:",
                        e
                    )

        # PHONE DETECTION

        phone_result = detect_phone(
            image_base64
        )

        # ATTENTION DETECTION

        attention_result = detect_attention(
            image_base64
        )

        # SAFE PHONE VALUE

        phone_value = "No Phone"

        if isinstance(phone_result, dict):

            phone_value = phone_result.get(
                "phone",
                "No Phone"
            )

        elif isinstance(phone_result, str):

            phone_value = phone_result

        # SAFE ATTENTION VALUE

        attention_value = "Attentive"

        if isinstance(attention_result, dict):

            attention_value = attention_result.get(
                "attention",
                "Attentive"
            )

        elif isinstance(attention_result, str):

            attention_value = attention_result

        # FINAL RESPONSE

        return {

            "students":
                detected_students,

            "phone":
                phone_value,

            "attention":
                attention_value

        }

    except Exception as e:

        print(
            "Tracking Error:",
            e
        )

        return {

            "students": [],

            "phone": "Error",

            "attention": "Error"

        }