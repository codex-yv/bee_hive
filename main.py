from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from starlette.status import HTTP_303_SEE_OTHER
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html
import secrets

from configs.access_configs import doc_username, doc_password

from utils.clientGets import get_all_clients

from utils.IST import ISTTime, ISTdate
from utils.devgets import push_notification_by_dev
from utils.settings import Settings

from schemas.DevSchemas import DevMessage

from templates_jinja import templates_home
from app.rtc import manager

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


app.mount("/static", StaticFiles(directory="app/static"), name="static")

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

@app.get("/")
async def welcome(request:Request):
    return templates_home.TemplateResponse("home.html", {"request":request})

@app.get("/home-members")
async def home_members_login(request:Request):
    return RedirectResponse("/client/entry/login", status_code=HTTP_303_SEE_OTHER)

@app.get("/home-admins")
async def home_admins_login(request:Request):
    return RedirectResponse("/admin/dashboard/admin-dashboard", status_code=HTTP_303_SEE_OTHER)

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