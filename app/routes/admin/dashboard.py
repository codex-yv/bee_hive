from fastapi import APIRouter, HTTPException, status, Request, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials


from schemas.adminProjectSchemas import AddProjectRequest, AddProjectResponse
from schemas.adminTasksSchemas import Task
from schemas.useless import Useless, UselessClient

from utils.adminPosts import insert_project, insert_task, push_notification_by_admin, first_admin_login
from utils.adminGets import (get_users, get_projects, get_tasks, get_projet_info,
                            get_task_info, get_admin_notification, admin_setting)
from utils.adminPuts import update_admin_notification

from utils.clientPuts import update_assign_member, update_project_manager, update_task_member

from utils.general import create_message, get_users_list, send_group_email_for_projects, send_email_for_task

from templates_jinja import templates_admin


from app.rtc import manager

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])


security = HTTPBasic()
async def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    admin_info = await admin_setting.getAdminInfo()

    correct_username = admin_info["admin_username"]
    correct_password = admin_info["admin_password"]

    if credentials.username != correct_username or credentials.password != correct_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return True

@router.get("/admin-dashboard") # FOR ADMIN PAGE.
async def load_admin(request:Request, authenticated: bool = Depends(verify_credentials)):
    request.session["email"] = "qwertyuiop"
    pd, total_projects = await get_projet_info()
    projects = await get_projects()
    recent_projects = projects[0:3]

    td, total_tasks = await get_task_info()
    tasks = await get_tasks()
    recent_tasks = tasks[0:3]
    await first_admin_login()
    return templates_admin.TemplateResponse("index.html", {"request":request, "tp":total_projects, "pd":pd, "tt":total_tasks, "td":td, "rp":recent_projects, "rt":recent_tasks})

@router.post("/add-project",
             response_model = AddProjectResponse,
             responses = {code : {"model":AddProjectResponse} for code in [500, 401]}) # FOR ADMIN PAGE.
async def admin_add_projects(request: Request, project: AddProjectRequest):

    auth = request.session.get("email")
    if auth:
        Inserted_id = await insert_project(project=project)
        await update_assign_member(collecation_name=project.assigned_members, pid=Inserted_id)
        await update_project_manager(collecation_name=project.project_manager, pid=Inserted_id)

        rmessage = await create_message(message=[project.project_name, "p"])

        await push_notification_by_admin(collections=project.assigned_members, message=rmessage)
        notification = [rmessage, 0, "2023-12-07T10:30:00"]
        to_users = await get_users_list(data = project.assigned_members)

        await manager.send_notification(notification, to_users)
        notify_for_project = await admin_setting.sendgridProject()
        if notify_for_project:
            await send_group_email_for_projects(emails = to_users, project_name=project.project_name)
        
        return AddProjectResponse(
            success = True, 
            message = "Project added successfully."
        )
    else:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = AddProjectResponse(
                success = False,
                message = "Redirecting to login page."
            ).model_dump(),
        )


@router.post("/add-task") # FOR ADMIN PAGE.
async def admin_add_tasks(request: Request, task: Task):
    Inserted_id = await insert_task(task=task)
    await update_task_member(collecation_name=task.assigned_members, pid=Inserted_id)

    rmessage = await create_message(message=[task.task_name, "t"])

    await push_notification_by_admin(collections=task.assigned_members, message=rmessage)
    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    to_users = await get_users_list(data = task.assigned_members)
    await manager.send_notification(notification, to_users)
    notify_for_task = await admin_setting.sendgridTask()
    if notify_for_task:
        await send_email_for_task(emails=to_users, task=task)


@router.post("/load-add-project") # FOR ADMIN PAGE.
async def load_add_projects(data:Useless):
    val = await get_users()
    return val
    
@router.post("/load-add-task") # FOR ADMIN PAGE.
async def load_add_projects(data:Useless):
    val = await get_users()
    return val

@router.post("/notification-admin")
async def get_notification_user(request:Request, x:UselessClient):
    notifications = await get_admin_notification()
    await update_admin_notification()
    # print(manager.get_connected_users())
    return notifications