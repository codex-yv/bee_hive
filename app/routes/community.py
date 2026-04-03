from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request, HTTPException, status
from fastapi.responses import JSONResponse
import uuid

from utils.clientPost import  save_unified_chat_message
from utils.clientGets import get_username,get_unified_chat_history

from utils.messageSystem import delete_message_from_db, add_reaction_to_db
from utils.IST import ISTTime, ISTdate

from schemas.messageSystemSchemas import DeleteMessageRequest, DeleteMessageResponse, ErrorResponse, AddReactionRequest, AddReactionResponse
from datetime import datetime

import json


from rtc import manager, unified_community_manager


router = APIRouter(prefix="/websocket", tags=["Admin Community"])

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Wait for any message from client (can be used for ping/pong or other commands)
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Handle different types of messages from client
            if message_data.get('type') == 'ping':
                # Respond to ping
                await manager.send_personal_message(json.dumps({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                }), user_id)
                
            elif message_data.get('type') == 'test_notification':
                # Echo test notification back to sender
                await manager.send_personal_message(json.dumps({
                    "type": "notification",
                    "notification": message_data.get('notification')
                }), user_id)
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
        manager.disconnect(user_id)


# Unified Community WebSocket endpoint for both clients and admins
@router.websocket("/ws/community/{user_id}")
async def unified_community_websocket_endpoint(websocket: WebSocket, user_id: str):
    # Determine if it's an admin or client based on user_id or session
    # For now, we'll check if user_id contains "admin" or use a different method
    user_type = "admin" if "@" not in user_id.lower() else "client"
    
    # Get username from database or use user_id as fallback
    username = "Admin" if user_type == "admin" else user_id
    
    await unified_community_manager.connect(websocket, user_id, username, user_type)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get('type') == 'chat_message':
                # Save message to database
                message_content = message_data.get('message', '').strip()
                if message_content:
                    # Store message in database
                    if username != "Admin":
                        chat_data = {
                            "message_id": str(uuid.uuid4()),
                            "user": user_id,
                            "username": await get_username(collection_name=user_id),
                            "message": message_content,
                            "replied": message_data.get('replied', {}),
                            "time": ISTTime() +" ["+ ISTdate()+"]",
                            "user_type": user_type
                        }
                    else:
                        chat_data = {
                            "message_id": str(uuid.uuid4()),
                            "user": user_id,
                            "username": username,
                            "message": message_content,
                            "replied": message_data.get('replied', {}),
                            "time": ISTTime() +" ["+ ISTdate()+"]",
                            "user_type": user_type
                        }
                    # Save to MongoDB
                    await save_unified_chat_message(chat_data)
                    
                    # Broadcast to ALL users (both clients and admins)
                    await unified_community_manager.broadcast_chat_message(chat_data)
                    
    except WebSocketDisconnect:
        unified_community_manager.disconnect(user_id)
    except Exception as e:
        print(f"Unified Community WebSocket error for user {user_id}: {e}")
        unified_community_manager.disconnect(user_id)


# HTTP endpoint to get unified community chats
@router.post("/community")
async def get_unified_community_chats(request: Request):
    try:
        # Get unified chat history from MongoDB
        chats = await get_unified_chat_history(user=request.session.get("email"))
        return chats
    except Exception as e:
        print(f"Error getting unified community chats: {e}")
        return JSONResponse(status_code=500, content={"error": "Failed to load chats"})
    

# HTTP endpoint to send message (works for both clients and admins)
@router.post("/send-message")
async def send_unified_chat_message(request: Request):
    try:
        print("HELLO WORLD")
        data = await request.json()
        message_content = data.get('message', '').strip()
        
        if not message_content:
            return JSONResponse(status_code=400, content={"error": "Message cannot be empty"})
        
        # Get user info from session or request
        # For demo purposes, we'll use placeholders - replace with actual authentication
        user_id = data.get('user_id', 'unknown_user')
        # username = data.get('username', 'Unknown User')
        # user_type = data.get('user_type', 'client')
        
        if "@" in user_id:
            username = await get_username(collection_name= request.session.get("email"))
            user_type = "client"
        else:
            username = "Admin"
            user_type = "admin"
        # Save message to database
        chat_data = {
            "message_id": str(uuid.uuid4()),
            "user": user_id,
            "username": username,
            "message": message_content,
            "replied": data.get('replied', {}),
            "time": ISTTime() +" ["+ ISTdate()+"]",
            "user_type": user_type
        }
        
        await save_unified_chat_message(chat_data)
        
        # Broadcast to ALL connected users (both clients and admins)
        await unified_community_manager.broadcast_chat_message(chat_data)
        
        return {"status": "success"}
        
    except Exception as e:
        print(f"Error sending unified message: {e}")
        return JSONResponse(status_code=500, content={"error": "Failed to send message"})


@router.post("/delete-message", 
          response_model=DeleteMessageResponse, 
          responses={500 : {"model": ErrorResponse}})
async def deleted_message(request:Request, req: DeleteMessageRequest):
    try:
        deletion_status = await delete_message_from_db(message_id=req.message_id, del_type=req.deletion_type, user=request.session.get("email"))

        # Broadcast real-time deletion event for DFE (Delete for Everyone)
        if req.deletion_type == "DFE" and deletion_status["success"]:
            del_msg = deletion_status.get("del_message", "This message was deleted")
            await unified_community_manager.broadcast_message_deleted(
                message_id=req.message_id,
                del_message=del_msg
            )

        return DeleteMessageResponse(
            success=deletion_status["success"],
            message=deletion_status["message"],
        )
    except Exception as e:
        raise HTTPException(
            status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= ErrorResponse(
                success= False,
                error= f"An error occured while deltion of message:{e}",
                message= "Unable to delete message due to internal server error."
            ).model_dump()
        )

@router.post("/add-reaction", 
          response_model=AddReactionResponse,
          responses={500 : {"model": ErrorResponse}})
async def add_reactions(request: Request, req:AddReactionRequest):
    try:
        request_status = await add_reaction_to_db(message_id=req.message_id, reaction=req.reaction, user= request.session.get("email"))

        # Broadcast real-time reaction update to all connected community users
        if request_status["success"]:
            await unified_community_manager.broadcast_message({
                "type": "reaction_added",
                "message_id": req.message_id,
                "react_count": request_status["react_count"],
                "reactions": request_status["reactions"]
            })

        return AddReactionResponse(
            success=request_status["success"],
            message=request_status["message"],
            react_count=request_status["react_count"],
            reactions=request_status["reactions"]
        )
    except Exception as e:
        return HTTPException(
            status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= ErrorResponse(
                success= False,
                error= f"An error occured while adding reaction:{e}",
                message= "Unable to add reaction due to internal server error."
            ).model_dump()
        )