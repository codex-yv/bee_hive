from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import RedirectResponse

from schemas.settings import SettingsPostRequest, SettingsGetResponse, SettingsResponse
from schemas.messageSystemSchemas import ErrorResponse

from utils.adminPosts import updateAdminSettings
from utils.adminGets import admin_setting

router = APIRouter(prefix = "/admin/settings", tags=["Admin Settings"])


@router.get("/fetch",
            response_model = SettingsGetResponse,
            responses = {500 : {"model": ErrorResponse}})
async def fetchAdminSettings(request:Request):
    auth = request.session.get("email")
    print(auth)
    try:
        if auth:
            result = await admin_setting.getAllSettings()
            return SettingsGetResponse(**result)
        else:
            return RedirectResponse(
                url = "/",
                status_code = status.HTTP_303_SEE_OTHER
            )
    except Exception as e:
        print(f"Failed to fetch the settings: {e}")

        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = ErrorResponse(
                success = True,
                error = f"Failed to fetch the settings: {e}"
            )
        )

@router.post("/save",
             response_model = SettingsResponse,
             responses={500 : {"model": ErrorResponse}})
async def updateSettingsRoute(request: Request, configs: SettingsPostRequest):
    try:
        result = await updateAdminSettings(configs)
        return SettingsResponse(**result)
    except Exception as e:
        print(f"Internal Server Error while updating the settings.{e}")
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = ErrorResponse(
                success = False,
                error = f"Internal Server Error while updating the settings.{e}"
            ).model_dump()
        )


