from fastapi.templating import Jinja2Templates

templates_clients = Jinja2Templates(directory="app/templates/clients")
templates_admin = Jinja2Templates(directory="app/templates/admin")