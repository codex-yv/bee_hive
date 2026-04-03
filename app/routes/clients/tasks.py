from fastapi import APIRouter, Request

from schemas.useless import UselessClient
from schemas.updateTskSchema import UpdateTask

from utils.adminPuts import update_task_status_act

from utils.clientPost import push_notification_by_client
from utils.clientGets import get_username, get_user_tasks, get_task_by_id
from utils.clientPuts import  update_task_status_bid

from utils.general import create_message_for_admin

from app.rtc import manager

router = APIRouter(prefix="/client/task", tags=["Client Task"])

@router.post("/client-tasks")
async def show_client_task(request: Request, x:UselessClient):
    val, total_task, done_task = await get_user_tasks(collection_name=request.session.get("email"))
    # print(val)
    return val


@router.post("/task-checkbox")
async def update_task_status(request: Request, data:UpdateTask):

    username = request.session.get("email")
    await update_task_status_act(pid = data.task_id, status=data.status, username=username)
    await update_task_status_bid(task_id = data.task_id, status = data.status, collection_name= username)

    fullname = await get_username(collection_name=username)
    taskname = await get_task_by_id(task_id=data.task_id)

    rmessage = await create_message_for_admin(fullname=fullname, project_taskname=taskname, status=data.status, sym='t')

    await push_notification_by_client(message=rmessage)

    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    to_users = ["qwertyuiop"]
    await manager.send_notification(notification, to_users)
