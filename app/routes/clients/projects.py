from fastapi import APIRouter, Request

from schemas.useless import  UselessClient
from schemas.updatePjtSchemas import UpdateProjets

from utils.adminPuts import update_project_status_act

from utils.clientPost import push_notification_by_client
from utils.clientGets import get_username, get_user_projects, get_project_by_id
from utils.clientPuts import update_project_status_bid

from utils.general import create_message_for_admin

from rtc import manager

router = APIRouter(prefix="/client/projects", tags=["Client Projects"])

@router.post("/client-projects")
async def show_client_projects(request: Request, x:UselessClient):
    val, total_projects, done_projects = await get_user_projects(collection_name=request.session.get("email"))
    return val

@router.post("/project-checkbox")
async def update_project_status(request: Request,data: UpdateProjets):
    username = request.session.get("email")
    await update_project_status_act(pid = data.project_id, status = data.status, username = username)
    await update_project_status_bid(project_id=data.project_id, status=data.status, collection_name=request.session.get("email"))

    fullname = await get_username(collection_name = username)
    project_name = await get_project_by_id(project_id=data.project_id)

    rmessage = await create_message_for_admin(fullname=fullname, project_taskname=project_name, status=data.status, sym='p')

    await push_notification_by_client(message=rmessage)

    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    to_users = ["qwertyuiop"]
    await manager.send_notification(notification, to_users)