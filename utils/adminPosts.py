from configs.trendyDB import client
from utils.IST import ISTdate
from utils.general import create_token

async def insert_project(project:object): # /see project schemas in adminProjectSchemas.py
    db = client['Activity']
    collection = db['Projects']
    date = f"{ISTdate()}"
    new_assigned_members = []
    for member in project.assigned_members:
        member.append(0)
        new_assigned_members.append(member)

    links = {}
    for head, link in project.links.items():
        links[create_token()] = {"head":head, "link": link}
    
    components = {}
    components["data"] = {}
    count = 0
    for key, value in project.components.items():
        components["data"][create_token()] = {"head":key, "body": value, "status": False, "owner":""}
        count +=1
    
    components["total_comp"] = count
    components["done_comp"] = 0
    components["status"] = False
    
    format_data = {
        "project_name":project.project_name,
        "project_description": project.project_description,
        "links":links,
        "initiated_date":date,
        "due_date":project.due_date,
        "team":project.team,
        "assigned_members":new_assigned_members,
        "project_manager":project.project_manager,
        "components":components,
        "status":0
    }

    result = await collection.insert_one(format_data)
    return result.inserted_id


async def insert_task(task):
    db = client['Activity']
    collection = db['Tasks']
    date = f"{ISTdate()}"
    new_assigned_members = []

    for member in task.assigned_members:
        member.append(0)
        new_assigned_members.append(member)

    format_data = {
        "task_name": task.task_name,
        "desc": task.desc,
        "initiated_date":date,
        "due_date": task.due_date,
        "assigned_members": new_assigned_members,
        "status":0
    }

    result = await collection.insert_one(format_data)
    return result.inserted_id

async def push_notification_by_admin(collections:list[list[str]], message:str):

    db = client["Clients"]
    aMessage = [message, 0]

    for collection_name in collections:
        collection = db[collection_name[0]]

        await collection.update_one(
            {"email":collection_name[0]},
            {"$push": {"notify": aMessage}}
        )


async def first_admin_login():
    db = client["Admins"]
    
    collections = await db.list_collection_names()
    if not collections:
        collection = db["Base"]
        admin_format = {
            "unique":"qwertyuiop",
            "notify":[],
            "status":""
        }
        await collection.insert_one(admin_format)

