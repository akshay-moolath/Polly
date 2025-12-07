from fastapi import FastAPI, WebSocket
import json
import asyncio


app = FastAPI()

clients = set()

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    clients.add(websocket)

    await websocket.send_text(json.dumps({"type": "system", "text": "Welcome to the chat!"}))

    while True:
        data = await websocket.receive_text()
        msg = json.loads(data)
        text = json.dumps(msg)
        await asyncio.gather(*[c.send_text(text) for c in clients])
