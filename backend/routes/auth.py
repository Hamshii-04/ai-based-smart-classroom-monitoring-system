from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.post("/login")
def login(data: dict):
    if data["username"] == "admin" and data["password"] == "1234":
        return {"status": "success"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")