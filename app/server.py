# app/server.py
from fastapi import FastAPI, WebSocket
import json

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        msg = json.loads(data)
        if msg.get("type") == "Hello from Client":
            response = {
                "type": "Hello from Server!",
                "id": msg.get("id")
                }
            
            await websocket.send_text(json.dumps(response))
        elif msg.get("type") == "ping":
            await websocket.send_text(json.dumps({"type": "pong", "id": msg.get("id")}))
        else:
            await websocket.send_text(json.dumps({"type": "unknown"}))
