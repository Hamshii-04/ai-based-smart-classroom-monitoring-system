import cv2
import numpy as np
from insightface.app import FaceAnalysis

class ArcFaceEngine:
    def __init__(self):
        self.app = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"]  # stable
        )
        self.app.prepare(ctx_id=0, det_size=(640, 640))

    def get_embedding(self, face):
        faces = self.app.get(face)

        if len(faces) == 0:
            return None

        return faces[0].embedding