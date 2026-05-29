import subprocess
import sys
import time

print("🚀 Starting Smart Classroom AI System...")

# =========================
# START BACKEND
# =========================
print("🔵 Starting FastAPI Backend...")

subprocess.Popen([
    sys.executable, "-m", "uvicorn",
    "backend.main:app",
    "--reload"
])

time.sleep(3)

# =========================
# START RECOGNITION
# =========================
print("🟢 Starting Face Recognition...")

subprocess.Popen([
    sys.executable,
    "scripts/recognition_live.py"
])

time.sleep(3)

# =========================
# START DASHBOARD
# =========================
print("🟣 Starting Dashboard...")

subprocess.Popen([
    sys.executable, "-m", "streamlit",
    "run", "frontend/dashboard.py"
])

print("✅ System Started Successfully")