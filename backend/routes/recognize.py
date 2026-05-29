from fastapi import APIRouter
from pydantic import BaseModel

from services.multi_tracking_service import (
    detect_multiple_faces
)

router = APIRouter()

# REQUEST MODEL

class ImageData(BaseModel):

    image: str

# RECOGNITION ROUTE

@router.post("/recognize")
async def recognize(data: ImageData):

    result = detect_multiple_faces(
        data.image
    )

    return result