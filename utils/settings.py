"""
* This file is not serving any role in the project and it can be deleted in
  near future.

* setting.json file can also be deleted as it is associated with this file.
"""

import json
import aiofiles

class Settings:
    _cache = None

    @classmethod
    async def load(cls):
        if cls._cache is None:
            async with aiofiles.open("option/settings.json", "r") as f:
                cls._cache = json.loads(await f.read())
        return cls._cache

    @classmethod
    async def email_verification_enabled(cls):
        settings = await cls.load()
        return settings["sendgrid"]["email_verification"]
    @classmethod
    async def approvals_notifications_enabled(cls):
        settings = await cls.load()
        return settings["sendgrid"]["approvals"]
    
    @classmethod
    async def projects_notifications_enabled(cls):
        settings = await cls.load()
        return settings["sendgrid"]["projects"]

    @classmethod
    async def tasks_notifications_enabled(cls):
        settings = await cls.load()
        return settings["sendgrid"]["tasks"]
