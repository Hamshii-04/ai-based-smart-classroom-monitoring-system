import face_recognition
import numpy as np

class FaceEngine:
    def get_embedding(self, face):
        rgb = face[:, :, ::-1]  # BGR → RGB
        encodings = face_recognition.face_encodings(rgb)

        if len(encodings) == 0:
            return None

        return encodings[0]