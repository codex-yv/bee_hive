from fastapi import APIRouter, Request

from schemas.useless import Useless

from utils.adminGets import get_all_members

router = APIRouter(prefix="/admin/profiles", tags=["Admin Profiles"])

@router.post("/mps")
async def show_members(request:Request, x:Useless):
    return_value = await get_all_members()
    # print(return_value)
    return return_value
