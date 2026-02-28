from pydantic import BaseModel


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
    status:bool
    message:str

class AddReactionRequest(BaseModel):
    message_id:str
    reaction:str