from pathlib import Path
from dotenv import load_dotenv
import os
import asyncio
import logging
import coloredlogs
from lib.db import Database
from lib.simulation import simulate_trashbin
from lib.mqtt_client import MQTTClient

load_dotenv()

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
    mqtt_client.publish("server/status", f'{{"server": "{status}"}}')
    await asyncio.sleep(1)
    mqtt_client.disconnect()


async def main():
    connection_string = os.getenv("DATABASE_URL")

    if not connection_string:
        raise ValueError("DATABASE_URL is not set.")

    db = Database(connection_string)
    await db.connect()

    try:
        current_time = await db.get_current_time()
        version = await db.get_version()
        print(f"Connected to database at {current_time} with version: {version}")
        await publish_server_status("online")

    except Exception as e:
        logging.error(f"DB error: {e}")
        return

    tasks = [asyncio.create_task(simulate_trashbin(id, db)) for id in TRASHBIN_IDS]

    try:
        await asyncio.Event().wait()
    except (asyncio.CancelledError, KeyboardInterrupt):
        logging.info("KeyboardInterrupt received. Cancelling tasks...")
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
    finally:
        await db.disconnect()
        logging.info("Server shutting down...")
        await publish_server_status("offline")
        logging.info("Shutdown complete.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Application manually stopped.")
