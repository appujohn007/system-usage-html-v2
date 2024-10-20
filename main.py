from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv
import os
import asyncio

# Load environment variables
load_dotenv()

app = FastAPI()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["PhubBotLog"]
collection = db["System_Days_Usage"]

# Static file serving for CSS and JS
app.mount("/static", StaticFiles(directory="static"), name="static")

# Template rendering
templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
async def startup_event():
    # Ensure a fresh event loop is created for each Lambda invocation if necessary
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            asyncio.set_event_loop(asyncio.new_event_loop())
    except RuntimeError:
        asyncio.set_event_loop(asyncio.new_event_loop())

@app.get("/", response_class=HTMLResponse)
async def get_home(request: Request):
    # Fetch distinct dates from the collection
    distinct_dates = await collection.distinct("_id")  # Assuming _id is the date
    return templates.TemplateResponse("index.html", {"request": request, "dates": distinct_dates})

@app.get("/usage/{date}")
async def get_usage_data(date: str):
    # Find the document for the given date
    document = await collection.find_one({"_id": date})
    if document:
        usage_data = document.get("usage", {})
        cpu_data = [{"time": k, "usage": v.get("cpu_usage", 0)} for k, v in usage_data.items()]
        ram_data = [{"time": k, "usage": v.get("ram_usage", 0)} for k, v in usage_data.items()]
        return {"cpu": cpu_data, "ram": ram_data}
    return {"cpu": [], "ram": []}
