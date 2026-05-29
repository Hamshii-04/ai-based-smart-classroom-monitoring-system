from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.register import router as register_router
from routes.recognize import router as recognize_router
from routes.attendance import router as attendance_router

app = FastAPI()

# CORS (important for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes
app.include_router(auth_router)
app.include_router(register_router)
app.include_router(recognize_router)
app.include_router(attendance_router)

@app.get("/")
def home():
    return {"status": "running"}