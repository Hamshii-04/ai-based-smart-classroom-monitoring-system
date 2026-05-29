from pymongo import MongoClient

# CONNECT TO MONGODB

client = MongoClient(
    "mongodb://localhost:27017"
)

# DATABASE

db = client["smart_classroom"]

# COLLECTIONS

students_collection = db["students"]

attendance_collection = db["attendance"]