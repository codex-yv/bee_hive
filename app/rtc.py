from fastapi import WebSocket
from utils.clientPuts import update_user_last_active
import asyncio
import json
from typing import List, Dict

# Store connected clients
class ConnectionManager:
    def __init__(self):
        # Dictionary to store active connections: {user_id: WebSocket}
        self.active_connections: Dict[str, WebSocket] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        # print(f"User {user_id} connected. Total connections: {len(self.active_connections)}")
        
        # Send current connected users to all clients (optional)
        await self.broadcast_connected_users()
        asyncio.create_task(update_user_last_active(collection_name=user_id, status=True))
        
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            # print(f"User {user_id} disconnected. Total connections: {len(self.active_connections)}")
            # Notify remaining users about connection change
            asyncio.create_task(self.broadcast_connected_users())
            asyncio.create_task(update_user_last_active(collection_name=user_id, status=False))
    
    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(message)
            except Exception as e:
                print(f"Error sending message to {user_id}: {e}")
                self.disconnect(user_id)
    
    async def send_notification(self, notification: List, to_users: List[str]):
        """
        Send notification to specific users
        notification format: [message, 0, timestamp]
        """
        message_data = {
            "type": "notification",
            "notification": notification
        }
        
        for user_id in to_users:
            if user_id in self.active_connections:
                try:
                    await self.active_connections[user_id].send_text(json.dumps(message_data))
                    # print(f"Notification sent to {user_id}: {notification[0]}")
                except Exception as e:
                    print(f"Error sending notification to {user_id}: {e}")
                    self.disconnect(user_id)
    
    async def broadcast(self, message: str):
        disconnected_users = []
        for user_id, connection in self.active_connections.items():
            try:
                await connection.send_text(message)
            except Exception as e:
                print(f"Error broadcasting to {user_id}: {e}")
                disconnected_users.append(user_id)
        
        # Remove disconnected users
        for user_id in disconnected_users:
            self.disconnect(user_id)
    
    async def broadcast_connected_users(self):
        """Broadcast list of connected users to all clients"""
        connected_users = list(self.active_connections.keys())
        message_data = {
            "type": "connected_users",
            "users": connected_users
        }
        await self.broadcast(json.dumps(message_data))
    
    def get_connected_users(self) -> List[str]:
        return list(self.active_connections.keys())
    

manager = ConnectionManager()


# Unified Community Connection Manager
class UnifiedCommunityConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_info: Dict[str, Dict] = {}  # Store user info like username and type
        
    async def connect(self, websocket: WebSocket, user_id: str, username: str = None, user_type: str = "client"):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_info[user_id] = {
            "username": username or user_id,
            "type": user_type
        }
        
        # Notify all users that someone joined
        await self.broadcast_user_joined(user_id, username)
        # print(f"User {user_id} ({user_type}) joined community chat. Total connections: {len(self.active_connections)}")
        
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            username = self.user_info[user_id].get("username", user_id)
            user_type = self.user_info[user_id].get("type", "client")
            del self.active_connections[user_id]
            if user_id in self.user_info:
                del self.user_info[user_id]
            
            # Notify all users that someone left
            asyncio.create_task(self.broadcast_user_left(user_id, username))
            # print(f"User {user_id} ({user_type}) left community chat. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(message)
            except Exception as e:
                print(f"Error sending message to {user_id}: {e}")
                self.disconnect(user_id)
    
    async def broadcast_message(self, message_data: dict):
        disconnected_users = []
        for user_id, connection in self.active_connections.items():
            try:
                await connection.send_text(json.dumps(message_data))
            except Exception as e:
                print(f"Error broadcasting to {user_id}: {e}")
                disconnected_users.append(user_id)
        
        # Remove disconnected users
        for user_id in disconnected_users:
            self.disconnect(user_id)
    
    async def broadcast_user_joined(self, user_id: str, username: str = None):
        message_data = {
            "type": "user_joined",
            "user_id": user_id,
            "username": username or user_id
        }
        await self.broadcast_message(message_data)
    
    async def broadcast_user_left(self, user_id: str, username: str = None):
        message_data = {
            "type": "user_left",
            "user_id": user_id,
            "username": username or user_id
        }
        await self.broadcast_message(message_data)
    
    async def broadcast_chat_message(self, message_data: dict):
        await self.broadcast_message({
            "type": "chat_message",
            "message": message_data
        })

    async def broadcast_image_upload(self, images: dict, alt_text: str, user_id: str = None, username: str = None, user_type: str = None, message_id: str = None, time: str = None):
        message = {
            "type": "image_upload",
            "images": images,
            "text": alt_text,
            "user": user_id,
            "username": username,
            "user_type": user_type,
            "message_id": message_id,
            "time": time
        }

        await self.broadcast_message(message)

    async def broadcast_message_deleted(self, message_id: str, del_message: str):
        await self.broadcast_message({
            "type": "message_deleted",
            "message_id": message_id,
            "del_message": del_message
        })

    # async def community_database_error(self, message_id:str, email:str):
    #     await self.send_personal_message(json.dumps({
    #         "type": "message_database_error",
    #         "message_id": message_id,
    #         "data": "Message could not be saved to the database"
    #     }), email)

    def get_connected_users(self) -> List[str]:
        return list(self.active_connections.keys())

# Create unified community connection manager instance
unified_community_manager = UnifiedCommunityConnectionManager()