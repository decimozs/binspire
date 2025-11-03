import { messaging } from "@/features/firebase";
import { MessagingRepository } from "@/repository";
import * as admin from "firebase-admin";
import type { Notification } from "firebase-admin/messaging";

export class MessagingService {
  private repo = new MessagingRepository();

  async registerFCM(userId: string, fcmToken: string) {
    return await this.repo.registerFCM(userId, fcmToken);
  }

  async sendNotification(
    token: string,
    notification: Notification,
    data?: { [key: string]: string },
  ) {
    const message: admin.messaging.Message = {
      token,
      notification: {
        imageUrl: "https://arcovia.binspire.space/favicon.ico",
        ...notification,
      },
      data,
      webpush: {
        fcmOptions: {
          link: data?.url,
        },
      },
    };

    await messaging.send(message);
  }

  async sendMulticastNotification(
    tokens: string[],
    notification: Notification,
    data?: { [key: string]: string },
  ) {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        imageUrl: "https://arcovia.binspire.space/favicon.ico",
        ...notification,
      },
      data,
      webpush: {
        fcmOptions: {
          link: data?.url,
        },
      },
    };

    await messaging.sendEachForMulticast(message);
  }
}
