# client/cli_client.py
import asyncio
import websockets
import json
import uuid

async def main():
    uri = "ws://127.0.0.1:8000/ws"
    async with websockets.connect(uri) as websocket:
        hello_msg = {"type": "hello", "id": str(uuid.uuid4()), "payload": {"who": "cli-1"}}
        await websocket.send(json.dumps(hello_msg))
        print("Sent:", hello_msg)
        while True:
            message = await websocket.recv()
            print("Received:", json.loads(message))

if __name__ == "__main__":
    asyncio.run(main())
