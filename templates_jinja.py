from fastapi.templating import Jinja2Templates

templates_clients = Jinja2Templates(directory="templates/clients")
templates_admin = Jinja2Templates(directory="templates/admin")