from pydantic import BaseModel
from typing import Union, List

class Updated(BaseModel):
    skills:list
    tnp:list

class GetProfileSchema(BaseModel):
    status: bool
    skills: Union[List, None]
    tnp: Union[List, None]
    team: str
    profile: Union[str, None]
    email: str

class UpdateProfileImage(BaseModel):
    status: bool
    message: str
