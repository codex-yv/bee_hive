from fastapi import APIRouter, Request, UploadFile, File, HTTPException, status
from starlette.status import HTTP_303_SEE_OTHER
from fastapi.responses import RedirectResponse

from schemas.useless import UselessClient
from schemas.profileSchemas import Updated, GetProfileSchema, UpdateProfileImage
from schemas.messageSystemSchemas import ErrorResponse

from utils.clientGets import  get_username, get_user_projects, get_user_tasks, get_client_profile, get_client_notification, get_total_unread_messages
from utils.clientPuts import update_user_profile, update_client_notification
from utils.clientPost import db_update_client_profile_image

from templates_jinja import templates_clients


router = APIRouter(prefix="/client/dashboard", tags=["Client Dashboard"])

import cloudinary.uploader
import cloudinary.api
import configs.cloudinary_config

"""
        *** Add required information about this file below ***

* print statement in the file will be replaced with logs.

"""

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


# update the index.js for POST -> GET and for Response Model
@router.get("/client-profile",
            response_model = GetProfileSchema,
            responses = {500 : {"model": ErrorResponse}})
async def userProfile(request:Request):
    try:
        details = await get_client_profile(collection_name= request.session.get("email"))
        return GetProfileSchema(**details)
    
    except Exception as e:
        print(f"An error has occured for GET request on endpoint '/client-profile' \n\n {e}")
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = ErrorResponse(
                success = False,
                error = f"Error: {e}",
                message = "An error has occured while fetching profile data."
            ).model_dump()
        )

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


@router.post("/add-profile-image",
             response_model = UpdateProfileImage,
             responses = {500 : {"model": ErrorResponse}})
async def save_profile_image(request:Request, image: UploadFile = File(...)):
    try:
        if request.session.get("email"):
            # uploading the image on cloudinary
            image_result = cloudinary.uploader.upload(image.file, folder = "beeHive")

            if image_result:
                image_info = image_result["secure_url"]
                result = await db_update_client_profile_image(image_url = image_info, client_email = request.session.get("email"))
                return UpdateProfileImage(**result)
            else:
                print("Failed to upload image on cloudinary.")
                raise HTTPException(
                    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail = ErrorResponse(
                        success = False,
                        error = f"ERROR: {e}",
                        message = "Failed to update profile image."
                    ).model_dump()
                )
        else:
            print("<<<<--- User is unauthorized! --->>>>")
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail = ErrorResponse(
                    success = False,
                    error = "UNAUTHORIZED: Session not found!",
                    message = "You are unauthorized, please Login!"
                )
            )
    except Exception as e:
        print(f"An error has occured on POST request on endpoint '/add-profile-image' \n\n {e}")
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = ErrorResponse(
                success = False,
                error = f"ERROR: {e}",
                message = "Failed to update profile image."
            ).model_dump()
        )