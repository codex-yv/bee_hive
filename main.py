from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Form, Body, HTTPException, status, Depends
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from starlette.status import HTTP_303_SEE_OTHER
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html
import secrets
import uuid
from configs.access_configs import doc_username, doc_password, admin_password, admin_username

from utils.adminPosts import insert_project, insert_task, push_notification_by_admin, first_admin_login
from utils.adminGets import get_users, get_projects, get_tasks, get_projet_info, get_task_info, get_users_for_approve, get_all_members, get_admin_notification
from utils.adminPuts import update_user_action, update_project_status_act, update_task_status_act, update_admin_notification, delete_project_by_id, delete_task_by_id

from utils.clientPost import add_new_client, push_notification_by_client, save_unified_chat_message
from utils.clientGets import check_existing_user, check_password, get_username, get_user_action, get_user_projects, get_user_tasks, get_client_profile, get_client_notification, get_project_by_id, get_task_by_id, get_total_unread_messages, get_unified_chat_history, get_all_clients
from utils.clientPuts import update_assign_member, update_task_member, update_project_manager, update_project_status_bid, update_task_status_bid, update_user_profile, update_client_notification, update_user_last_active
from utils.messageSystem import delete_message_from_db, add_reaction_to_db
from utils.general import create_message, get_users_list, create_message_for_admin, send_otp, send_password, send_group_email_for_projects, send_email_for_task, send_request_result
from utils.IST import ISTTime, ISTdate
from utils.devgets import get_total_users, push_notification_by_dev
from utils.settings import Settings

from configs.devConfig import dev

from schemas.newclientSchemas import NewUser
from schemas.otpSchemas import OTPDetails, Email
from schemas.loginSchemas import LoginSchema
from schemas.adminProjectSchemas import Project
from schemas.adminTasksSchemas import Task
from schemas.useless import Useless, UselessClient
from schemas.adminActionSchemas import AdminAction
from schemas.updatePjtSchemas import UpdateProjets
from schemas.updateTskSchema import UpdateTask
from schemas.profileSchemas import Updated
from schemas.DevSchemas import DevMessage
from schemas.messageSystemSchemas import DeleteMessageRequest, DeleteMessageResponse, ErrorResponse, AddReactionRequest, AddReactionResponse
from datetime import datetime
from typing import Dict, List
import json
import asyncio

from rtc import manager, unified_community_manager

from app.routes.clients.dashboard import router as client_dashboard
from app.routes.clients.projects import router as client_projects
from app.routes.clients.tasks import router as client_tasks
from app.routes.clients.entry import router as client_entry

from app.routes.admin.dashboard import router as admin_dashboard
from app.routes.admin.pendings import router as admin_pendings
from app.routes.admin.profiles import router as admin_profiles
from app.routes.admin.projects import router as admin_projects
from app.routes.admin.tasks import router as admin_tasks

from app.routes.community import router as all_community
templates_clients = Jinja2Templates(directory="templates/clients")
templates_admin = Jinja2Templates(directory="templates/admin")


app = FastAPI(docs_url=None, redoc_url=None)

app.include_router(client_dashboard)
app.include_router(client_projects)
app.include_router(client_tasks)
app.include_router(client_entry)

app.include_router(admin_dashboard)
app.include_router(admin_projects)
app.include_router(admin_tasks)
app.include_router(admin_pendings)
app.include_router(admin_profiles)

app.include_router(all_community)


app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(SessionMiddleware, secret_key="qwertyuiopasdfghjkl@#$%RTYU") # fetch from env, it's just for demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
settings = Settings()
security = HTTPBasic()

def get_current_user(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, doc_username)
    correct_password = secrets.compare_digest(credentials.password, doc_password)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username



@app.get("/docs", include_in_schema=False)
def custom_swagger_ui(user: str = Depends(get_current_user)):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="Secure API Docs")


@app.api_route("/", methods=["HEAD"], operation_id="welcome_get")
async def welcome_head():
    return {"Message": "Ok"}


@app.post("/super-sender")
async def send_developer_notification_to_all(request:Request, message:DevMessage):
    members = await get_all_clients()
    information = f" on {ISTdate()} at {ISTTime()}"
    rmessage = message.message + information
    
    await push_notification_by_dev(collections=members, message=rmessage)

    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    to_users = ["qwertyuiop"] + members
    await manager.send_notification(notification, to_users)

    return {"message":"Success"}