from fastapi import APIRouter

from schemas.useless import Useless

from utils.adminPosts import push_notification_by_admin
from utils.adminGets import get_projects
from utils.adminPuts import delete_project_by_id


from utils.general import get_users_list
from utils.IST import ISTTime, ISTdate

from app.rtc import manager

router = APIRouter(prefix="/admin/projects", tags=["Admin Projects"])


@router.post("/show-project-status") # FOR ADMIN PAGE.
async def show_projects(data:Useless):
    val = await get_projects()
    return val

@router.post("/delete-project") # For admin Page
async def delete_project(data:Useless):
    members, project_title = await delete_project_by_id(project_id=data.x)
    rmessage = f"The project {project_title.title()} which was assigned to you, is deleted by the admin on {ISTdate()} at {ISTTime()}."
    asgn_members = await get_users_list(data=members)
    await push_notification_by_admin(collections=members, message=rmessage)
    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    await manager.send_notification(notification, asgn_members)
    # print(data.x)
    return True