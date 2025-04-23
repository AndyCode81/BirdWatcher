# 
# Author: Andy Ayala
# Date: April 23, 2025
# Description: This is a test script for the BirdWatch Live Anomaly Detector. It uses a WebSocket server to send real-time anomaly detection results to the front-end.
# Note: This is test code and is not related to Isaiah Goad's back-end implementation.

from scapy.all import sniff
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from fastapi import FastAPI, WebSocket
import uvicorn

# Load the pre-trained anomaly detection model
model = joblib.load("/Users/andyayala/Desktop/BirdWatcher/BirdWatch_Live_Anomaly/anomaly_model_ocsvm.pkl")

app = FastAPI()
clients = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        clients.remove(websocket)

def extract_features(pkt):
    try:
        return {
            "packet_len": len(pkt),
            "protocol": pkt.proto if hasattr(pkt, "proto") else 0,
            "timestamp": datetime.now().timestamp()
        }
    except:
        return None

def handle_packet(pkt):
    features = extract_features(pkt)
    if features:
        df = pd.DataFrame([features])
        df["timestamp"] = df["timestamp"].diff().fillna(0)
        prediction = model.predict(df)

        result = {
            "time": str(datetime.now().strftime("%H:%M:%S")),
            "anomaly": int(prediction[0])
        }

        for ws in clients:
            try:
                import asyncio
                asyncio.create_task(ws.send_json(result))
            except:
                pass

def start_sniffing():
    sniff(prn=handle_packet, store=False)

import threading
import time

if __name__ == "__main__":
    # Start packet sniffing AFTER a tiny delay to ensure WebSocket route is ready
    def delayed_sniff():
        time.sleep(1)
        start_sniffing()

    threading.Thread(target=delayed_sniff).start()
    uvicorn.run(app, host="0.0.0.0", port=8000)