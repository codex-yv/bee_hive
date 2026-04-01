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