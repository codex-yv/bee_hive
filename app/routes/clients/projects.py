from fastapi import APIRouter, Request

from schemas.useless import  UselessClient
from schemas.updatePjtSchemas import UpdateProjets, UpdateComponent, UpdateComponentResponse

from utils.adminPuts import update_project_status_act, update_project_components_status_act, update_project_component_status_via_checkbox

from utils.clientPost import push_notification_by_client
from utils.clientGets import get_username, get_user_projects, get_project_by_id
from utils.clientPuts import update_project_status_bid

from utils.general import create_message_for_admin

from app.rtc import manager

router = APIRouter(prefix="/client/projects", tags=["Client Projects"])

@router.post("/client-projects")
async def show_client_projects(request: Request, x:UselessClient):
    val, total_projects, done_projects = await get_user_projects(collection_name=request.session.get("email"))
    return val

@router.post("/project-checkbox")
async def update_project_status(request: Request,data: UpdateProjets):
    username = request.session.get("email")
    await update_project_status_act(pid = data.project_id, status = data.status, username = username)
    await update_project_components_status_act(pid = data.project_id, status = data.status, username = username)
    await update_project_status_bid(project_id=data.project_id, status=data.status, collection_name=request.session.get("email"))

    fullname = await get_username(collection_name = username)
    project_name = await get_project_by_id(project_id=data.project_id)

    rmessage = await create_message_for_admin(fullname=fullname, project_taskname=project_name, status=data.status, sym='p')

    await push_notification_by_client(message=rmessage)

    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    to_users = ["qwertyuiop"]
    await manager.send_notification(notification, to_users)


@router.post("/component-checkbox", 
             response_model = UpdateComponentResponse)
async def update_component_status(request: Request,data: UpdateComponent):
    percentage, status, component_head = await update_project_component_status_via_checkbox(pid=data.project_id, status=data.status, username=request.session.get("email"), component_id=data.component_id)
    
    fullname = await get_username(collection_name = request.session.get("email"))
    rmessage = await create_message_for_admin(fullname=fullname, project_taskname=component_head, status=data.status, sym='c')

    await push_notification_by_client(message=rmessage)

    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    to_users = ["qwertyuiop"]

    await manager.send_notification(notification, to_users)
    
    return UpdateComponentResponse(
        success = True,
        percentage = percentage,
        status = status
    )