from fastapi import APIRouter
from fastapi.responses import FileResponse

from database import (
    students_collection,
    attendance_collection
)

import pandas as pd

router = APIRouter()

# ---------------- GET ATTENDANCE ----------------

@router.get("/attendance")
def get_attendance():

    records = list(

        attendance_collection.find(
            {},
            {"_id": 0}
        )

    )

    return records

# ---------------- TOTAL STUDENTS ----------------

@router.get("/students/count")
def student_count():

    count = students_collection.count_documents({})

    return {

        "count": count

    }

# ---------------- EXPORT CSV ----------------

@router.get("/export")
def export_csv():

    records = list(

        attendance_collection.find(
            {},
            {"_id": 0}
        )

    )

    df = pd.DataFrame(records)

    file_name = "attendance.csv"

    df.to_csv(
        file_name,
        index=False
    )

    return FileResponse(

        file_name,

        filename=file_name

    )