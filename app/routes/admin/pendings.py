from fastapi import APIRouter


from schemas.useless import Useless
from schemas.adminActionSchemas import AdminAction

from utils.adminGets import get_users_for_approve
from utils.adminPuts import update_user_action


from utils.general import send_request_result
from utils.settings import Settings


router = APIRouter(prefix="/admin/pendings", tags=["Admin Pendings"])

settings = Settings()

@router.post("/approve-signups") # FOR ADMIN PAGE.
async def show_signup_request(data:Useless):
    user_list = await get_users_for_approve()
    return user_list

@router.post("/action-admin") # FOR ADMIN PAGE.
async def admin_action(data:AdminAction):

    await update_user_action(email=data.email, action=data.action)
    notify_approval = await settings.approvals_notifications_enabled()
    if notify_approval:
        await send_request_result(data=data)