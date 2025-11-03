import { rpc } from "../lib/api-client";

export class MessagingApi {
  static async register(userId: string, fcmToken: string) {
    const response = await rpc.api.messaging.register.$post({
      json: { userId, fcmToken },
    });

    if (!response.ok) throw new Error("Failed to register FCM token");

    return response.json();
  }

  static async sendNotification(
    token: string,
    notification: { title: string; body: string },
  ) {
    const response = await rpc.api.messaging["send-notification"].$post({
      json: {
        token,
        notification,
      },
    });

    console.log("response: ", await response.json());

    if (!response.ok) throw new Error("Failed to send notification");

    return response.json();
  }
}
