import os
import base64
import numpy as np

from deepface import DeepFace

from datetime import datetime

from database import (
    attendance_collection
)

# ---------------- DATABASE PATH ----------------

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

DB_PATH = os.path.join(
    BASE_DIR,
    "Database"
)

# ---------------- MODEL SETTINGS ----------------

MODEL_NAME = "Facenet"

THRESHOLD = 0.50

# ---------------- EMBEDDING STORAGE ----------------

database = {}

# ---------------- LOAD DATABASE ----------------

def load_database():

    global database

    database = {}

    if not os.path.exists(DB_PATH):

        os.makedirs(DB_PATH)

    for person in os.listdir(DB_PATH):

        person_path = os.path.join(
            DB_PATH,
            person
        )

        if not os.path.isdir(person_path):

            continue

        embeddings = []

        for img in os.listdir(person_path):

            path = os.path.join(
                person_path,
                img
            )

            try:

                emb = DeepFace.represent(

                    img_path=path,

                    model_name=MODEL_NAME,

                    enforce_detection=True,

                    align=False

                )[0]["embedding"]

                embeddings.append(emb)

            except Exception as e:

                print(
                    "Embedding Error:",
                    e
                )

        if embeddings:

            database[person] = np.mean(

                embeddings,

                axis=0

            )

    print(
        "Loaded Users:",
        list(database.keys())
    )

# ---------------- INITIAL LOAD ----------------

load_database()

# ---------------- COSINE SIMILARITY ----------------

def cosine(a, b):

    return np.dot(a, b) / (

        np.linalg.norm(a)

        *

        np.linalg.norm(b)

    )

# ---------------- RECOGNIZE FACE ----------------

def recognize_face(image):

    try:

        # BASE64 → IMAGE

        img_data = base64.b64decode(
            image.split(",")[1]
        )

        temp_path = os.path.join(
            BASE_DIR,
            "temp.jpg"
        )

        with open(temp_path, "wb") as f:

            f.write(img_data)

        # CREATE EMBEDDING

        emb = DeepFace.represent(

            img_path=temp_path,

            model_name=MODEL_NAME,

            enforce_detection=True,

            align=False

        )[0]["embedding"]

        best_name = "Unknown"

        best_score = 0

        # COMPARE DATABASE

        for person, db_emb in database.items():

            score = cosine(
                emb,
                db_emb
            )

            if score > best_score:

                best_score = score

                best_name = person

        print(
            "Best Match:",
            best_name,
            best_score
        )

        confidence = round(
            best_score * 100,
            2
        )

        # MATCH FOUND

        if best_score > THRESHOLD:

            mark_attendance(best_name)

            return {

                "name": best_name,

                "score": confidence

            }

        # UNKNOWN FACE

        return {

            "name": "Unknown",

            "score": confidence

        }

    except Exception as e:

        print(
            "Recognition Error:",
            e
        )

        return {

            "name": "Error",

            "score": 0

        }

# ---------------- ADD NEW USER ----------------

def add_person_embedding(name):

    person_path = os.path.join(
        DB_PATH,
        name
    )

    if not os.path.exists(person_path):

        return

    embeddings = []

    for img in os.listdir(person_path):

        path = os.path.join(
            person_path,
            img
        )

        try:

            emb = DeepFace.represent(

                img_path=path,

                model_name=MODEL_NAME,

                enforce_detection=True,

                align=True

            )[0]["embedding"]

            embeddings.append(emb)

        except Exception as e:

            print(
                "Add Person Error:",
                e
            )

    if embeddings:

        database[name] = np.mean(

            embeddings,

            axis=0

        )

        print(
            f"{name} embeddings updated"
        )

# ---------------- ATTENDANCE ----------------

def mark_attendance(name):

    now = datetime.now()

    date = now.strftime(
        "%Y-%m-%d"
    )

    time = now.strftime(
        "%H:%M:%S"
    )

    # PREVENT DUPLICATES

    existing = attendance_collection.find_one({

        "name": name,

        "date": date

    })

    if existing:

        print(
            f"{name} already marked today"
        )

        return

    # SAVE TO MONGODB

    attendance_collection.insert_one({

        "name": name,

        "date": date,

        "time": time

    })

    print(
        f"Attendance Marked: {name}"
    )