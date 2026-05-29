from ultralytics import YOLO

import cv2
import numpy as np
import base64

# LOAD YOLO MODEL

model = YOLO("yolov8n.pt")

def detect_phone(image_base64):

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

        results = model(frame)

        for result in results:

            boxes = result.boxes

            for box in boxes:

                cls = int(box.cls[0])

                label = model.names[cls]

                confidence = float(
                    box.conf[0]
                )

                # PHONE DETECTED

                if (
                    label == "cell phone"
                    and confidence > 0.25
                ):

                    return {

                        "phone":
                            "Using Phone",

                        "confidence":
                            round(
                                confidence * 100,
                                2
                            )

                    }

        return {

            "phone": "No Phone",

            "confidence": 0

        }

    except Exception as e:

        print(e)

        return {

            "phone": "Error",

            "confidence": 0

        }