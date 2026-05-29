from fastapi import APIRouter
from pydantic import BaseModel

import os
import base64

from services.face_service import (
    add_person_embedding,
    load_database
)

from database import (
    students_collection
)

router = APIRouter()


# REQUEST MODEL

class RegisterData(BaseModel):

    name: str

    image: str


# BASE DIRECTORY

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)


# REGISTER ROUTE

@router.post("/register")
async def register(data: RegisterData):

    try:

        name = data.name

        image = data.image

        # CREATE STUDENT FOLDER

        person_path = os.path.join(
            BASE_DIR,
            "Database",
            name
        )

        os.makedirs(
            person_path,
            exist_ok=True
        )

        # SAVE IMAGE

        image_data = base64.b64decode(
            image.split(",")[1]
        )

        image_count = len(
            os.listdir(person_path)
        )

        image_path = os.path.join(

            person_path,

            f"{image_count + 1}.jpg"

        )

        with open(
            image_path,
            "wb"
        ) as f:

            f.write(image_data)

        # UPDATE FACE DATABASE

        add_person_embedding(name)

        load_database()

        # SAVE TO MONGODB

        existing_student = (
            students_collection.find_one({

                "name": name

            })
        )

        if not existing_student:

            students_collection.insert_one({

                "name": name,

                "registered": True

            })

        return {

            "status": "success",

            "message":
                f"{name} registered successfully"

        }

    except Exception as e:

        print(e)

        return {

            "status": "error",

            "message": str(e)

        }