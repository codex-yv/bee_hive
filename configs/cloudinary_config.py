import cloudinary
from dotenv import load_dotenv
import os

load_dotenv()

CLOUD_NAME = os.getenv("CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_SECRET_KEY = os.getenv("CLOUDINARY_SECRET_KEY")

cloudinary.config(
    cloud_name= CLOUD_NAME,
    api_key= CLOUDINARY_API_KEY,
    api_secret= CLOUDINARY_SECRET_KEY
)