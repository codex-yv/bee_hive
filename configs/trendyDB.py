from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncIOMotorClient(os.getenv('MONGO_URI')) # mongod --port 27020 --dbpath /data/tirthghumo