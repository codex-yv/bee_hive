from configs.trendyDB import client
from security.encryptPass import encryptt

async def add_new_client(client_add:dict):
    db = client["Clients"]
    collection = db[client_add.email]
    key, token = encryptt(password=client_add.password)
    format_data = {
        "fullname":client_add.fullName,
        "email":client_add.email,
        "phone":client_add.phone,
        "password":token,
        "key":key,
        "status":"ACTIVE",
        "profileImg":"",
        "team":client_add.team,
        "role":client_add.role,
        "skills":client_add.skills,
        "tnp":client_add.tnp,
        "assigned_projects":[],  # total projects done
        "assigned_task":[],    # pending projects
        "project_manager":[],
        "notifications":[],     # ongoing projects
        "techstack":{},
        "action":-1
    }

    await collection.insert_one(format_data)


async def push_notification_by_client(message:str):

    db = client["Admins"]
    collection = db["Base"]

    aMessage = [message, 0]
    
    await collection.update_one(
        {"unique":"qwertyuiop"},
        {"$push": {"notify": aMessage}}
    )


async def save_unified_chat_message(chat_data: dict, msg_type:str):
    """
    Save chat message to database
    Replace this with your actual database implementation
    """
    db = client["History"]
    collection = db["chat"]

    format_chat = {
        'message_id':chat_data['message_id'],
        'user':chat_data['user'],
        'username':chat_data['username'],
        'msg_type':msg_type,
        'message':chat_data['message'],
        'images': chat_data['images'],
        "replied":chat_data['replied'],
        "ghost":[],
        "del_message":None,
        "is_deleted":False,
        "reactions":{},
        "react_count":{},
        'time':chat_data['time'], 
        'user_type':chat_data['user_type']
    }

    await collection.insert_one(format_chat)

async def db_update_client_profile_image(image_url:str, client_email: str):
    db = client["Clients"]
    collection = db[client_email]

    try:
        result = await collection.update_one({"email":client_email},
                                    {"$set":{"profileImg":image_url}})
        if result.modified_count:
            return {
                "status": True,
                "message": "Profile Image Updated Successfully."
            }
        else:
            print("'email' doest match with client_email.")
            return {
                "status": "",
                "message": "Client does not exist."
            }
    except Exception as e:
        print(f"Error has occurred while saving image in database:\n\n {e}")
        return {
            "status": False,
            "message": f"Can't save image due to {e}"
        }