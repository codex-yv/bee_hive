from pydantic import BaseModel
from typing import List, Dict, Union

class AddProjectRequest(BaseModel):
    project_name: str
    project_description: str
    links: Dict[str, str]
    due_date: str
    team: str
    assigned_members: List[List] # / assigned_members = [[email, name, status]]
    project_manager: List[List]
    components: Dict[str, str]

class AddProjectResponse(BaseModel):
    success: bool
    message: str
    