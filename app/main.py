from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles#for getting simple html page for login,register and dashboard
from fastapi.responses import FileResponse
from app.db import Base, engine
from app.server import router as ws_router
from app.user import router as user

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(ws_router)
app.include_router(user, prefix="/api")
@app.get("/")# connecting static pages to url/endpoint
def home():
    return FileResponse("static/login.html")


@app.get("/register-page")
def register_page():
    return FileResponse("static/register.html")

@app.get("/dashboard")
def dashboard_page():
    return FileResponse("static/dashboard.html")