from fastapi import APIRouter

from schemas.useless import Useless

from utils.adminPosts import push_notification_by_admin
from utils.adminGets import get_tasks
from utils.adminPuts import delete_task_by_id


from utils.general import get_users_list
from utils.IST import ISTTime, ISTdate

from app.rtc import manager

router = APIRouter(prefix="/admin/tasks", tags=["Admin Tasks"])


@router.post("/show-task-status") # FOR ADMIN PAGE.
async def show_task(data:Useless):
    val = await get_tasks()
    return val

@router.post("/delete-task") # for admin page
async def delete_task(data:Useless):
    members, task_title = await delete_task_by_id(task_id=data.x)
    rmessage = f"The task {task_title.title()} which was assigned to you, is deleted by the admin on {ISTdate()} at {ISTTime()}."
    asgn_members = await get_users_list(data=members)
    await push_notification_by_admin(collections=members, message=rmessage)
    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    await manager.send_notification(notification, asgn_members)
    # print(data.x)
    return True