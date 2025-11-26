import logging
import os
import ssl
import paho.mqtt.client as paho

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)


class MQTTClient:
    def __init__(
        self,
        broker=os.getenv("MQTT_BROKER"),
        port=os.getenv("MQTT_PORT"),
        client_id=None,
        username=os.getenv("MQTT_USERNAME"),
        password=os.getenv("MQTT_PASSWORD"),
    ):
        self.client = paho.Client(client_id=client_id, protocol=paho.MQTTv5)
        self.client.tls_set(tls_version=ssl.PROTOCOL_TLS)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        if username and password:
            self.client.username_pw_set(username, password)

        self.broker = broker
        self.port = port

    def on_connect(self, client, userdata, flags, rc, properties=None):
        logging.info("Connected to HiveMQ.")

    def on_message(self, client, userdata, msg):
        logging.info(f"Received message: {msg.topic} {msg.payload.decode()}")

    def connect(self):
        self.client.connect(self.broker, self.port, 60)
        self.client.loop_start()

    def publish(self, topic, message):
        self.client.publish(topic, message)
        logging.info("Message published.")

    def subscribe(self, topic):
        self.client.subscribe(topic)
        logging.info(f"Subscribed to {topic}")

    def disconnect(self):
        logging.info("Disconnecting from HiveMQ...")
        self.client.loop_stop()
        self.client.disconnect()
