import logging
import random
import json
import asyncio
import coloredlogs
from lib.mqtt_client import MQTTClient
from lib.db import Database
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
coloredlogs.install(
    level="DEBUG", logger=logger, fmt="%(asctime)s [%(levelname)s] %(message)s"
)

WASTE_CLASSES = ["Plastics", "Paper", "Electronic Device", "Glass", "Metal", "Organic"]
BATTERY_CRITICAL_THRESHOLD = 10
BATTERY_LOW_THRESHOLD = 30


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
    waste_level_topic = f"trashbin/{id}/waste_level"
    weight_level_topic = f"trashbin/{id}/weight_level"
    detections_topic = f"trashbin/{id}/detections"
    battery_level_topic = f"trashbin/{id}/battery_level"
    alert_topic = f"trashbin/{id}/alerts"

    try:
        while True:
            # 🔹 Simulate sensor data
            # waste_level = random.randint(0, 2) - test overflow bins
            # waste_level = random.randint(50, 79) - test almost-full bins
            # waste_level = random.randint(3, 49) - default

            level_type = random.choice(
                ["empty", "low", "almost-full", "full", "overflowing"]
            )

            if level_type == "empty":
                waste_level = random.randint(42, 53)
            elif level_type == "low":
                waste_level = random.randint(27, 41)
            elif level_type == "almost-full":
                waste_level = random.randint(11, 26)
            elif level_type == "full":
                waste_level = random.randint(3, 10)
            else:
                waste_level = random.randint(0, 2)

            weight_level = round(random.uniform(0, 30), 2)
            battery_level = random.randint(0, 100)

            # 🔹 Compute urgency score (0.0 - 1.0)
            urgency_score = (waste_level / 100) * 0.6 + (weight_level / 30) * 0.4

            logger.debug(
                f"{id}: Waste={waste_level}%, Weight={weight_level}kg, Battery={battery_level}%, Urgency={urgency_score:.2f}"
            )

            async with db.pool.acquire() as connection:
                trashbin = await connection.fetchrow(
                    "SELECT * FROM trashbin WHERE id = $1", id
                )

                if not trashbin:
                    logger.warning(f"{id}: Trashbin not found in database.")
                    await asyncio.sleep(5)
                    continue

                # 🟢 Schedule logic based on urgency score
                if urgency_score >= 0.75:
                    await connection.execute(
                        """
                        UPDATE trashbin_status
                        SET is_scheduled = TRUE,
                            scheduled_at = NOW()
                        WHERE trashbin_id = $1 AND is_scheduled = FALSE
                        """,
                        id,
                    )
                    logger.info(
                        f"{id}: Marked as scheduled (urgency={urgency_score:.2f})."
                    )

            waste_level_message = {
                "wasteLevel": waste_level,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

            client.publish(waste_level_topic, json.dumps(waste_level_message, indent=2))

            logger.info(
                f"{id}: Published status message to topic '{waste_level_topic}'"
            )

            weight_level_message = {
                "weightLevel": weight_level,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

            client.publish(
                weight_level_topic, json.dumps(weight_level_message, indent=2)
            )

            logger.info(
                f"{id}: Published status message to topic '{weight_level_topic}'"
            )

            battery_level_message = {
                "voltage": round(random.uniform(3.2, 4.2), 2),
                "current_mA": round(random.uniform(-200, 500), 1),
                "power_W": round(random.uniform(0.0, 2.5), 2),
                "batteryLevel": battery_level,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

            client.publish(
                battery_level_topic, json.dumps(battery_level_message, indent=2)
            )

            logger.info(
                f"{id}: Published battery data to topic '{battery_level_topic}'"
            )

            if battery_level <= BATTERY_LOW_THRESHOLD:
                bin_name = trashbin["name"]
                bin_location = trashbin["location"]

                alert_message = {
                    "bin_id": id,
                    "name": bin_name,
                    "event": "battery_low",
                    "location": bin_location,
                    "battery_level": battery_level,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "message": f"Battery critical: {battery_level}% remaining",
                }

                client.publish(alert_topic, json.dumps(alert_message, indent=2))
                logger.warning(
                    f"{id}: ⚠️ Battery critical ({battery_level}%) - alert sent"
                )

            if battery_level <= BATTERY_CRITICAL_THRESHOLD:
                bin_name = trashbin["name"]
                bin_location = trashbin["location"]

                alert_message = {
                    "bin_id": id,
                    "name": bin_name,
                    "event": "battery_critical",
                    "location": bin_location,
                    "battery_level": battery_level,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "message": f"Battery critical: {battery_level}% remaining",
                }
                client.publish(alert_topic, json.dumps(alert_message, indent=2))
                logger.warning(
                    f"{id}: ⚠️ Battery critical ({battery_level}%) - alert sent"
                )

            # 🧠 Simulated detection
            detected_class = random.choice(WASTE_CLASSES)
            confidence = round(random.uniform(0.2, 0.99), 2)
            detection_message = {
                "class": detected_class,
                "confidence": confidence,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "imageUrl": "https://www.binspire.space/twitter-image.png",
            }

            client.publish(detections_topic, json.dumps(detection_message))
            logger.info(f"{id}: Published detection '{detected_class}' ({confidence})")

            await asyncio.sleep(5)

    except asyncio.CancelledError:
        logger.warning(f"{id}: Task cancelled, disconnecting client.")
        client.disconnect()
    except Exception as e:
        logger.error(f"{id}: Unexpected error occurred - {e}", exc_info=True)
        client.disconnect()
