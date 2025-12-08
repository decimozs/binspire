import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccountJson = Bun.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
  throw new Error(
    "FATAL: FIREBASE_SERVICE_ACCOUNT_JSON environment variable not found.",
  );
}

const serviceAccountConfig = JSON.parse(serviceAccountJson) as ServiceAccount;

initializeApp({
  credential: cert(serviceAccountConfig),
});

export const messaging = getMessaging();
