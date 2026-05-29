import cv2
import numpy as np
import base64

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)

def detect_attention(image_base64):

    try:

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

        gray = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2GRAY
        )

        faces = face_cascade.detectMultiScale(

            gray,

            scaleFactor=1.2,

            minNeighbors=5,

            minSize=(120, 120)

        )

        if len(faces) == 0:

            return "No Face"

        frame_center = frame.shape[1] // 2

        for (x, y, w, h) in faces:

            face_center = x + w // 2

            # FACE SIZE

            face_area = w * h

            # TOO SMALL

            if face_area < 25000:

                return "Far From Camera"

            # LOOKING LEFT

            if face_center < frame_center - 180:

                return "Looking Left"

            # LOOKING RIGHT

            elif face_center > frame_center + 180:

                return "Looking Right"

            # ATTENTIVE

            else:

                return "Attentive"

        return "Unknown"

    except Exception as e:

        print(e)

        return "Error"