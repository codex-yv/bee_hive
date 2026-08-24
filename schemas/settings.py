from pydantic import BaseModel
from typing import Union, Dict

#fields required for post request 
class SettingsPostRequest(BaseModel):
    doc_username: str
    doc_password: str
    admin_username: str
    admin_password: str
    project_email: bool
    task_email: bool
    approve_email: bool
    email_verification: bool

class SettingsGetResponse(BaseModel):
    configs: Union[Dict[str, Union[str, bool]], None]
    status: bool
    message: str

# response for settings' get and post request.
class SettingsResponse(BaseModel):
    status: bool
    message: str


