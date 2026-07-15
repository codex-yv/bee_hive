from utils.IST import ISTdate, ISTTime
from utils.clientGets import get_client_password, get_username
import random
from configs.otp_configs import sender_email, sender_key
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import asyncio
import string

async def create_message(message:list[str, str]):
    
    """
    message = ["project or task name", "p - if project or t - if task"]
    """
    if message[1] == 'p':
        rMessage = f"Project '{message[0].title()}' is assigned to you on {ISTdate()} at {ISTTime()}"
    else:
        rMessage = f"Task '{message[0].title()}' is assigned to you on {ISTdate()} at {ISTTime()}"

    return rMessage


async def get_users_list(data):
    users = []
    for user in data:
        users.append(user[0])
    return users


async def create_message_for_admin(fullname:str, project_taskname:str, status:int, sym:str):
    '''
    message = [project/task name, username, t/p, s]
    '''

    if sym == 'p':
        if status == 1:
            rMessage = f"{fullname} has MARKED the project '{project_taskname['project_name']}' for completed on {ISTdate()} at {ISTTime()}!"
        else:
            rMessage = f"{fullname} has UNMARKED the project '{project_taskname['project_name']}' for Incomplete on {ISTdate()} at {ISTTime()}!"
    elif sym == 'c':
        if status == 1:
            rMessage = f"{fullname} has MARKED the component '{project_taskname}' as completed on {ISTdate()} at {ISTTime()}!"
        else:
            rMessage = f"{fullname} has MARKED the component '{project_taskname}' as Incomplete on {ISTdate()} at {ISTTime()}!"
    else:
        if status == 1:
            rMessage = f"{fullname} has MARKED the task '{project_taskname['task_name']}' for completed on {ISTdate()} at {ISTTime()}!"
        else:
            rMessage = f"{fullname} has UNMARKED the task '{project_taskname['task_name']}' for Incomplete on {ISTdate()} at {ISTTime()}!"

    return rMessage

async def generate_otp():
    otp = random.randint(100000, 999999)
    return otp

async def send_otp(email: str):
    otp = await generate_otp()
    print("SENDING")
    message = Mail(
        from_email=sender_email,  # must be verified in SendGrid
        to_emails=email,
        subject="Your OTP Code",
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
            <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                <h2 style="color:#333; text-align:center;">✨ Trendy Member's Portal Verification</h2>
                <p style="color:#444; font-size:15px;">Hi there,</p>
                <p style="color:#444; font-size:15px;">
                    Your one-time password (OTP) to <b>sign up at Trendy Member's Portal</b> is:
                </p>
                <div style="text-align:center; margin:20px 0;">
                    <span style="display:inline-block; font-size:24px; font-weight:bold; letter-spacing:4px; color:#e91e63; padding:10px 20px; border:2px dashed #e91e63; border-radius:6px;">
                        {otp}
                    </span>
                </div>
                <p style="color:#444; font-size:15px;">
                    ⏳ This code is valid for <b>5 minutes</b>. Please do not share it with anyone for your account’s safety.
                </p>
                <p style="color:#444; font-size:15px; margin-top:30px;">
                    Thanks,<br>
                    <b>Trendy Team</b>
                </p>
                <hr style="margin:20px 0; border:none; border-top:1px solid #eee;">
                <p style="font-size:12px; color:#888; text-align:center;">
                    If you didn’t request this code, you can safely ignore this email.
                </p>
            </div>
        </body>
        </html>
        """


            )

    try:
        sg = SendGridAPIClient(sender_key)
        sg.send(message)
        return otp
    except Exception as e:
        print(f"Error sending email: {e}")
        return None
    
async def send_password(email: str):
    password = await get_client_password(collection_name=email)

    message = Mail(
        from_email=sender_email,  # must be verified in SendGrid
        to_emails=email,
        subject="Your password for Trendy member portal login.",
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
            <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                <h2 style="color:#333; text-align:center;">🔑 Trendy Member's Portal Login Details</h2>
                <p style="color:#444; font-size:15px;">Hi there,</p>
                <p style="color:#444; font-size:15px;">
                    Your password to <b>log in to Trendy Member's Portal</b> is:
                </p>
                <div style="text-align:center; margin:20px 0;">
                    <span style="display:inline-block; font-size:24px; font-weight:bold; letter-spacing:2px; color:#e91e63; padding:10px 20px; border:2px dashed #e91e63; border-radius:6px;">
                        {password}
                    </span>
                </div>
                <p style="color:#444; font-size:15px;">
                    🔒 Please keep this password confidential and do not share it with anyone.
                </p>
                <p style="color:#444; font-size:15px; margin-top:30px;">
                    Thanks,<br>
                    <b>Trendy Team</b>
                </p>
                <hr style="margin:20px 0; border:none; border-top:1px solid #eee;">
                <p style="font-size:12px; color:#888; text-align:center;">
                    If you didn’t request this password, please contact our support team immediately.
                </p>
            </div>
        </body>
        </html>
        """
            )

    try:
        sg = SendGridAPIClient(sender_key)
        sg.send(message)
        return 1
    except Exception as e:
        print(f"Error sending email: {e}")
        return 2
    

async def send_group_email_for_projects(emails: list, project_name: str):
    sg = SendGridAPIClient(sender_key)  # Reuse one client for all

    async def send_single_email(email: str):
        try:
            username = await get_username(collection_name=email)
            message = Mail(
                from_email=sender_email,
                to_emails=email,
                subject="You have been assigned for a new project.",
                html_content=f"""
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
                    <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                        <h2 style="color:#333; text-align:center;">📢 New Project Assigned</h2>
                        <p style="color:#444; font-size:15px;">Hi {username},</p>
                        <p style="color:#444; font-size:15px;">
                            Great news! You’ve been <b>assigned to a new project</b> under the <b>Trendy Member's Portal</b>.
                        </p>
                        <div style="background:#f1f1f1; padding:15px; border-radius:6px; margin:20px 0;">
                            <p style="margin:0; color:#333; font-size:15px;">
                                🗂️ <b>Project Name:</b> {project_name}<br>
                                👤 <b>Assigned By:</b> ADMIN<br>
                                📅 <b>Assigned On:</b> {ISTdate()}
                            </p>
                        </div>
                        <p style="color:#444; font-size:15px;">
                            Please log in to your <b>Trendy Member’s Portal</b> to view the complete details.
                        </p>
                        <p style="color:#444; font-size:15px; margin-top:30px;">
                            Best regards,<br>
                            <b>Trendy Team</b>
                        </p>
                    </div>
                </body>
                </html>
                """
            )

            # Send email in background thread
            await asyncio.to_thread(sg.send, message)
        except Exception as e:
            print(f"Error sending email to {email}: {e}")

    # Run all sends concurrently
    await asyncio.gather(*(send_single_email(email) for email in emails))


async def send_email_for_task(emails: str, task:object):
    sg = SendGridAPIClient(sender_key)  # Reuse one client for all

    async def send_single_email(email: str):
        try:
            username = await get_username(collection_name=email)
            message = Mail(
                from_email=sender_email,
                to_emails=email,
                subject="You have been assigned for a new task.",
                html_content=f"""
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
                    <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                        <h2 style="color:#333; text-align:center;">📝 New Task Assigned</h2>
                        <p style="color:#444; font-size:15px;">Hi {username},</p>
                        <p style="color:#444; font-size:15px;">
                            You’ve been <b>assigned a new task</b> in the <b>Trendy Member's Portal</b>. Here are the details:
                        </p>
                        <div style="background:#f1f1f1; padding:15px; border-radius:6px; margin:20px 0;">
                            <p style="margin:0; color:#333; font-size:15px;">
                                ✅ <b>Task Title:</b> {task.task_name}<br>
                                📋 <b>Assigned By:</b> ADMIN<br>
                                ⏰ <b>Due Date:</b> {task.due_date}
                            </p>
                        </div>
                        <p style="color:#444; font-size:15px;">
                            Please log in to your <b>Trendy Member’s Portal</b> to check the full task details and get started.
                        </p>
                        <p style="color:#444; font-size:15px; margin-top:30px;">
                            Best regards,<br>
                            <b>Trendy Team</b>
                        </p>
                        <hr style="margin:20px 0; border:none; border-top:1px solid #eee;">
                        <p style="font-size:12px; color:#888; text-align:center;">
                            This is an automated notification from Trendy Member’s Portal. Please do not reply to this email.
                        </p>
                    </div>
                </body>
                </html>
                """
            )

            # Send email in background thread
            await asyncio.to_thread(sg.send, message)
        except Exception as e:
            print(f"Error sending email to {email}: {e}")

    # Run all sends concurrently
    await asyncio.gather(*(send_single_email(email) for email in emails))


async def send_request_result(data:object):
    username = await get_username(collection_name=data.email)
    if data.action == 1:
        subjectd="Your request to join the Trendy Member's Portal has been approved."
        html_contentd = f"""
        <!DOCTYPE html>
        <html>

        <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
            <div
                style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                <h2 style="color:#333; text-align:center;">🎉 Welcome to Trendy Member's Portal!</h2>
                <p style="color:#444; font-size:15px;">Hi there,</p>
                <p style="color:#444; font-size:15px;">
                    Great news! 🎊 Your <b>request to join the Trendy Member's Portal</b> has been <b>approved</b>.
                </p>
                <p style="color:#444; font-size:15px;">
                    Dear {username} you can now log in to your account using the credentials that you shared earlier with us and start exploring all the
                    features available for members.
                </p>
                <div style="text-align:center; margin-top:25px;">
                    <a href="https://trendy-nmx8.onrender.com/login"
                        style="background-color:#e91e63; color:#fff; text-decoration:none; padding:10px 25px; border-radius:6px; font-weight:bold; display:inline-block;">
                        Go to Portal
                    </a>
                </div>
                <p style="color:#444; font-size:15px; margin-top:30px;">
                    We're excited to have you on board! If you have any questions, feel free to reach out to our support team
                    anytime.
                </p>
                <p style="color:#444; font-size:15px; margin-top:20px;">
                    Best regards,<br>
                    <b>Trendy Team</b>
                </p>
                <hr style="margin:20px 0; border:none; border-top:1px solid #eee;">
                <p style="font-size:12px; color:#888; text-align:center;">
                    This is an automated confirmation email from Trendy Member’s Portal. Please do not reply.
                </p>
            </div>
        </body>

        </html>
        """
    else:
        subjectd="Your request to join the Trendy Member's Portal has been rejected.",
        html_contentd = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
            <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                <h2 style="color:#d32f2f; text-align:center;">❌ Request Rejected</h2>
                <p style="color:#444; font-size:15px;">Hi there,</p>
                <p style="color:#444; font-size:15px;">
                    Dear {username} we regret to inform you that your <b>request to join the Trendy Member's Portal</b> has been <b>rejected</b> at this time.
                </p>
                <p style="color:#444; font-size:15px;">
                    This may be due to incomplete details, eligibility criteria, or other verification requirements not being met.
                </p>
                <p style="color:#444; font-size:15px;">
                    You can review your submitted details and <b>reapply</b> if you believe this was a mistake or once you’ve updated your information.
                </p>
                <div style="text-align:center; margin-top:25px;">
                    <a href="https://trendy-nmx8.onrender.com/login" style="background-color:#d32f2f; color:#fff; text-decoration:none; padding:10px 25px; border-radius:6px; font-weight:bold; display:inline-block;">
                        Reapply
                    </a>
                </div>
                <p style="color:#444; font-size:15px; margin-top:30px;">
                    If you need assistance or more information regarding this decision, feel free to contact our support team.
                </p>
                <p style="color:#444; font-size:15px; margin-top:20px;">
                    Regards,<br>
                    <b>Trendy Team</b>
                </p>
                <hr style="margin:20px 0; border:none; border-top:1px solid #eee;">
                <p style="font-size:12px; color:#888; text-align:center;">
                    This is an automated notification from Trendy Member’s Portal. Please do not reply to this email.
                </p>
            </div>
        </body>
        </html>
        """

    message = Mail(
        from_email=sender_email,  # must be verified in SendGrid
        to_emails=data.email,
        subject=subjectd,
        html_content =html_contentd)
    
    try:
        sg = SendGridAPIClient(sender_key)
        await asyncio.to_thread(sg.send, message)
    except Exception as e:
        print(f"Error sending email: {e}")


async def is_completed_project(members:list[list]):
    for member in members:
        try:
            if member[2] !=1:
                return 0
            else:
                continue
        except IndexError:
            return 0
    return 1
    

def create_token():
    # List of alphabets
    alphabets = list(string.ascii_lowercase)

    pre = ''.join(random.sample(alphabets, 3))
    mid = ''.join(random.sample(alphabets, 3))
    end = ''.join(random.sample(alphabets, 3))

    token = pre+"-"+mid+"-"+end

    return token