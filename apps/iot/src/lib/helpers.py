import logging
import random
import json
import asyncio
import coloredlogs
from lib.mqtt_client import MQTTClient
from lib.db import Database

logger = logging.getLogger(__name__)
coloredlogs.install(
    level="DEBUG", logger=logger, fmt="%(asctime)s [%(levelname)s] %(message)s"
)


async def simulate_trashbin(id, db: Database):
    if not db.pool:
        logger.critical("Database connection is not established.")
        raise RuntimeError("Database connection is not established.")

    if id is None:
        logger.critical("Trashbin ID is None.")
        raise ValueError("Trashbin ID cannot be None.")

    logger.debug(f"Starting simulation for trashbin ID: {id}")

    client = MQTTClient(client_id=f"trashbin_{id}")
    client.connect()
    topic = f"trashbin/{id}/status"
    logger.info(f"{id}: MQTT client connected and publishing to topic '{topic}'")

    try:
        while True:
            waste_level = random.randint(0, 100)
            weight_level = round(random.uniform(0, 30), 2)
            battery_level = random.randint(0, 100)

            urgency_score = (waste_level / 100) * 0.6 + (weight_level / 30) * 0.4
            logger.debug(
                f"{id}: Simulated - Waste: {waste_level}%, Weight: {weight_level}kg, Battery: {battery_level}%, Urgency: {urgency_score:.2f}"
            )

            async with db.pool.acquire() as connection:
                trashbin = await connection.fetchrow(
                    "SELECT * FROM trashbin WHERE id = $1", id
                )

                if not trashbin:
                    logger.warning(f"{id}: Trashbin not found in database.")
                    await asyncio.sleep(5)
                    continue

            message = {
                "trashbin": {
                    "id": trashbin["id"],
                    "latitude": (
                        float(trashbin["latitude"]) if trashbin["latitude"] else None
                    ),
                    "longitude": (
                        float(trashbin["longitude"]) if trashbin["longitude"] else None
                    ),
                    "status": {
                        "wasteLevel": waste_level,
                        "weightLevel": weight_level,
                        "batteryLevel": battery_level,
                    },
                },
            }

            json_message = json.dumps(message, indent=2)
            client.publish(topic, json_message)
            logger.info(f"{id}: Published MQTT message to topic '{topic}'")

            await asyncio.sleep(5)

    except asyncio.CancelledError:
        logger.warning(f"{id}: Task cancelled, disconnecting client.")
        client.disconnect()

    except Exception as e:
        logger.error(f"{id}: Unexpected error occurred - {e}", exc_info=True)
        client.disconnect()
