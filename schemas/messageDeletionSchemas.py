from pydantic import BaseModel


class DeleteMessageResponse(BaseModel):
    success: bool
    message: str

class DeleteMessageRequest(BaseModel):
    message_id: str
    deletion_type:str

class DeleteMsgErrorResponse(BaseModel):
    success: bool
    error:str
    message:str