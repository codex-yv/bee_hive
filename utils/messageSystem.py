from configs.trendyDB import client
from utils.clientGets import get_username
async def delete_message_from_db(message_id:str, del_type:str, user:str = None)-> dict:
    db = client["History"]
    collection = db["chat"]
    message_data = await collection.find_one({"message_id": message_id})
    if message_data:
        try:
            if del_type == "DFE":
                if user == "qwertyuiop": # default value of user for admin
                    updated_values_dfe = {
                        "is_deleted": del_type,
                        "del_message":"This message is deleted by admin.",
                    }
                elif user == message_data.get("user"):
                    updated_values_dfe = {
                        "is_deleted": del_type,
                        "del_message":"This message is deleted.",
                    }
                else:
                    updated_values_dfe = {}


                if updated_values_dfe:
                    await collection.update_one({
                        "message_id":message_id
                    },{"$set":updated_values_dfe})
                    
                else:
                    return {
                        "success":False,
                        "message":"You can't delete other's message for everyone."
                    }
                
                return {
                    "success": True,
                    "message": "Message deleted.",
                    "del_message": updated_values_dfe.get("del_message", "This message was deleted")
                }
            elif del_type == "DFM":
                current_ghost = message_data.get("ghost")
                current_ghost.append(user)

                updated_values_dfm = {
                    "is_deleted":del_type,
                    "ghost": current_ghost
                }

                await collection.update_one({
                        "message_id":message_id
                    },{"$set":updated_values_dfm})
                return {
                    "success":True,
                    "message":"Message deleted."
                }
        except KeyError:
            return {
                "success":False,
                "message":"This message can't be deleted (ISE)."
            }
            

    else:
        return {
            "success":False,
            "message":"Message not found!"
        }


async def add_reaction_to_db(message_id:str, reaction:str, user:str):
    db = client["History"]
    collection = db["chat"]
    message_data = await collection.find_one({"message_id": message_id})
    if user == "qwertyuiop":
        username = "admin"
    else:
        username = await get_username(collection_name=user)

    if message_data:

        current_reaction = message_data.get("reactions", {})
        # {user:{message_id:str, reaction:str, username:str}}
        current_reaction[user] = {
            "message_id":message_id,
            "username":username,
            "reaction": reaction
        }

        await collection.update_one({
                "message_id":message_id
            },{"$set":{"reactions":current_reaction}})
        
        react_count = await count_and_update_reactions_from_message(message_id=message_id)

        return {
            "success":True,
            "message":"Reaction Added.",
            "react_count":react_count,
            "reactions":current_reaction
        }

    else:
        return {
            "success":False,
            "message":"Message not found!",
            "react_count":{},
            "reactions":{}
        }
    


async def count_and_update_reactions_from_message(message_id:str) -> dict:
    db = client["History"]
    collection = db["chat"]
    message_data = await collection.find_one({"message_id": message_id})

    reactions = message_data.get("reactions")

    reaction_count = {}

    for user, info in reactions.items():
        icon = info["reaction"]
        if icon in reaction_count:
            icon_count = reaction_count[icon]
            reaction_count[icon] = icon_count + 1
        else:
            reaction_count[icon] = 1
    
    await collection.update_one({
            "message_id":message_id
        },{"$set":{"react_count": reaction_count}})
    
    return reaction_count
