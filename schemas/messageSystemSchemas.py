from pydantic import BaseModel
from typing import Union


class DeleteMessageResponse(BaseModel):
    success: bool
    message: str

class DeleteMessageRequest(BaseModel):
    message_id: str
    deletion_type:str

class ErrorResponse(BaseModel):
    success: bool
    error:str
    message:str


class AddReactionResponse(BaseModel):
    success:bool
    message:str
    react_count:dict
    reactions:dict

class AddReactionRequest(BaseModel):
    message_id:str
    reaction:str

class SendMessageRequest(BaseModel):
    msg_type: str
    message: str
    user_type: str
    replied: Union[bool, dict]

class SendMessageResponse(BaseModel):
    success: bool
    message: str

class UploadImageRequest(BaseModel):
    alt_text:str
    user_id: str
    user_name: str
    user_type: str
    replied: Union[bool, dict]


class UploadImageResponse(BaseModel):
    status: bool
    message: str