from fastapi import APIRouter, Request, Body
from starlette.status import HTTP_303_SEE_OTHER
from fastapi.responses import RedirectResponse, JSONResponse

from schemas.newclientSchemas import NewUser
from schemas.otpSchemas import OTPDetails, Email
from schemas.loginSchemas import LoginSchema

from utils.clientPost import add_new_client, push_notification_by_client
from utils.clientGets import check_existing_user, check_password, get_username, get_user_action

from utils.general import send_otp, send_password
from utils.IST import ISTTime, ISTdate
from utils.settings import Settings
from utils.IST import ISTTime, ISTdate

from templates_jinja import templates_clients
from rtc import manager


router = APIRouter(prefix="/client/entry", tags=["Client Entry"])

settings = Settings()


@router.get("/login") # FOR Client PAGE.
async def home(request:Request):
    return templates_clients.TemplateResponse("login.html", {"request":request})

@router.get("/rejected")
async def display_rejected_page(request: Request):
    fullname = await get_username(collection_name=request.session.get("email"))
    return templates_clients.TemplateResponse("rejected.html", {"request": request, "fullname": fullname})

@router.get("/pending")
async def display_pending_page(request: Request):

    fullname = await get_username(collection_name=request.session.get("email"))
    return templates_clients.TemplateResponse("pending.html", {"request": request, "fullname": fullname})

@router.get("/success")
async def sign_up_success(request: Request):
    return templates_clients.TemplateResponse("success.html", {"request": request})


@router.post("/create-acc") # FOR Client PAGE.
async def add_new_user(request: Request, data: NewUser = Body(...)):
    request.session["email"] = data.email
    request.session["password"] = data.password

    if not await check_existing_user(collection_name=data.email):
        return JSONResponse(content=0)  # Email already exists

    # Validate OTP
    to_validate = await settings.email_verification_enabled()
    if to_validate:
        try:
            if int(data.otp)!= int(request.session.get("otp")):  # Replace with real OTP validation
                return JSONResponse(content=1) 
        except ValueError:
            return JSONResponse(content=1) 

    await add_new_client(client_add=data)

    rmessage = f" A new user '{(data.fullName).title()}' has send a signup request with email '{data.email}' on {ISTdate()} at {ISTTime()}."

    await push_notification_by_client(message=rmessage)

    notification = [rmessage, 0, "2023-12-07T10:30:00"]
    to_users = ["qwertyuiop"]
    await manager.send_notification(notification, to_users)

    return RedirectResponse(url="/client/entry/success", status_code=303)


@router.post("/send-otp") # FOR Client PAGE.
async def validate_otp(request: Request, data: OTPDetails = Body(...)):
    to_validate = await settings.email_verification_enabled()
    if to_validate:
        request.session["otp"] = await send_otp(email=data.email)
    return 1


@router.post("/make-login") # FOR Client PAGE.
async def trendy_login(request: Request, data: LoginSchema = Body(...)):

    request.session["email"] = data.email
    request.session["password"] = data.password

    if not await check_existing_user(collection_name=data.email):
        if await check_password(collection_name=data.email, password=data.password):
            action = await get_user_action(collection_name=data.email)

            if action == 0:
                return RedirectResponse(url="/client/entry/rejected", status_code=HTTP_303_SEE_OTHER)
            elif action == -1:
                return RedirectResponse(url="/client/entry/pending", status_code=HTTP_303_SEE_OTHER)
            else:        
                return RedirectResponse(url="/client/dashboard/dashboard", status_code=HTTP_303_SEE_OTHER)
        else:
            return 1
    else:
        return 0

@router.post("/forget-password")
async def forget_password(request:Request, data:Email):
    if not await check_existing_user(collection_name=data.email):
        val = await send_password(email= data.email)
        return val
    else:
        return 0
