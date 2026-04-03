from fastapi import APIRouter, Request
from starlette.status import HTTP_303_SEE_OTHER
from fastapi.responses import RedirectResponse

from schemas.useless import UselessClient
from schemas.profileSchemas import Updated

from utils.clientGets import  get_username, get_user_projects, get_user_tasks, get_client_profile, get_client_notification, get_total_unread_messages
from utils.clientPuts import update_user_profile, update_client_notification

from templates_jinja import templates_clients

router = APIRouter(prefix="/client/dashboard", tags=["Client Dashboard"])


@router.get("/dashboard") # FOR Client PAGE.
async def get_dashboard(request: Request):
    try:
        fullname = await get_username(collection_name=request.session.get("email"))
        tasks, total_task, done_task = await get_user_tasks(collection_name=request.session.get("email"))
        projects, total_projects, done_projects = await get_user_projects(collection_name=request.session.get("email"))
        details = {
            "total assigned projects": total_projects,          
            "completed projects": done_projects,               
            "total assigned tasks": total_task,             
            "completed tasks": done_task,                  
            "recent projects": projects,                
            "recent tasks": tasks                    
        }
        unread = await get_total_unread_messages(collection_name=request.session.get("email"))
        return templates_clients.TemplateResponse("index.html", {"request": request, "fullname": fullname, "details":details, "emailUser":request.session.get("email"), "unreadd": unread})

    except TypeError:
        return RedirectResponse("/client/entry/login", status_code=HTTP_303_SEE_OTHER)
    


@router.post("/client-dashboard")
async def update_dashboard_fapi(request: Request, x:UselessClient):
    tasks, total_task, done_task = await get_user_tasks(collection_name=request.session.get("email"))
    projects, total_projects, done_projects = await get_user_projects(collection_name=request.session.get("email"))
    details = {
        "total assigned projects": total_projects,          
        "completed projects": done_projects,               
        "total assigned tasks": total_task,             
        "completed tasks": done_task,                  
        "recent projects": projects,                
        "recent tasks": tasks                    
    }
    return details


@router.post("/client-profile")
async def userProfile(request:Request, x:UselessClient):
    details = await get_client_profile(collection_name= request.session.get("email"))
    return details

@router.post("/update-profile")
async def updateProfile(request:Request, data:Updated):
    if data.skills or data.tnp:
        await update_user_profile(collection_name=request.session.get("email"), data=data)
        return 0
    else:
        return 1
    

@router.post("/notification-user")
async def get_notification_user(request:Request, x:UselessClient):
    notifications = await get_client_notification(collection_name=request.session.get("email"))
    await update_client_notification(collection_name=request.session.get("email"))
    return notifications