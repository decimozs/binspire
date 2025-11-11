from pathlib import Path
from dotenv import load_dotenv
import os
import json
import asyncio
import logging
import coloredlogs
from lib.db import Database
from lib.simulation import simulate_trashbin
from lib.mqtt_client import MQTTClient

# ✅ Load environment variables
load_dotenv()

# 🎨 Log color styles
field_styles = {
    "asctime": {"color": "cyan"},
    "levelname": {"bold": True, "color": "magenta"},
    "message": {"color": "white"},
}

level_styles = {
    "debug": {"color": "blue"},
    "info": {"color": "green"},
    "warning": {"color": "yellow"},
    "error": {"color": "red"},
    "critical": {"bold": True, "color": "red", "background": "white"},
}

coloredlogs.install(
    level="DEBUG",
    fmt="%(asctime)s [%(levelname)s] %(message)s",
    field_styles=field_styles,
    level_styles=level_styles,
)

TRASHBIN_IDS = [
    "EN7MIZC5jw_CJHPzffRRV",
    "B_Uc917V41aG-LCJEPL-b",
    "8b-Rz33FfRMHdJm7klYG1",
]


async def publish_server_status(status: str):
    """Helper to publish server online/offline status"""
    mqtt_client = MQTTClient(client_id="server_status")
    mqtt_client.connect()
    payload = json.dumps({"server": status})  # ✅ convert to JSON string
    mqtt_client.publish("server/status", payload)
    await asyncio.sleep(1)
    mqtt_client.disconnect()
    logging.info(f"Server status '{status}' published.")


# 🟢 Background loop to ping server status every 60 seconds
async def ping_server_status():
    while True:
        try:
            await publish_server_status("online")
        except Exception as e:
            logging.error(f"Failed to publish server status: {e}")
        await asyncio.sleep(60)


async def main():
    connection_string = os.getenv("DATABASE_URL")

    if not connection_string:
        raise ValueError("DATABASE_URL is not set in .env file.")

    db = Database(connection_string)
    await db.connect()

    try:
        current_time = await db.get_current_time()
        version = await db.get_version()
        logging.info(f"Connected to database at {current_time} with version: {version}")
        await publish_server_status("online")

    except Exception as e:
        logging.error(f"Database error: {e}")
        return

    # ✅ Start simulation tasks for all bins
    bin_tasks = [asyncio.create_task(simulate_trashbin(id, db)) for id in TRASHBIN_IDS]
    # ✅ Add a task to continuously ping server status
    ping_task = asyncio.create_task(ping_server_status())

    all_tasks = bin_tasks + [ping_task]

    try:
        await asyncio.Event().wait()  # runs until interrupted
    except (asyncio.CancelledError, KeyboardInterrupt):
        logging.info("KeyboardInterrupt received. Cancelling tasks...")
        for task in all_tasks:
            task.cancel()
        await asyncio.gather(*all_tasks, return_exceptions=True)
    finally:
        logging.info("Disconnecting database...")
        await db.disconnect()
        logging.info("Publishing 'offline' status before shutdown...")
        await publish_server_status("offline")
        logging.info("Server shutdown complete.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Application manually stopped.")
