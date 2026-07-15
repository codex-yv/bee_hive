from pydantic import BaseModel

class UpdateProjets(BaseModel):
    project_id:str
    status:int

class UpdateComponent(BaseModel):
    project_id:str
    status:int
    component_id:str

class UpdateComponentResponse(BaseModel):
    success: bool
    percentage:str
    status: bool