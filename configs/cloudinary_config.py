import cloudinary

from app.config.settings import CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY
cloudinary.config(
    cloud_name= CLOUD_NAME,
    api_key= CLOUDINARY_API_KEY,
    api_secret= CLOUDINARY_SECRET_KEY
)