import { nanoid } from "nanoid";

type Actions = {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};

type Section = {
  actions: Actions;
};

type Permissions = Record<string, Section>;

type CheckResult = {
  allTrue: boolean;
  sectionsWithFalse: string[];
};

export function typeOfACL(obj: Permissions): CheckResult {
  const result: CheckResult = {
    allTrue: true,
    sectionsWithFalse: [],
  };

  for (const [sectionName, sectionData] of Object.entries(obj)) {
    const actions = Object.values(sectionData.actions);
    if (!actions.every((value) => value === true)) {
      result.allTrue = false;
      result.sectionsWithFalse.push(sectionName);
    }
  }

  return result;
}

export async function encryptWithSecret(secret: string, plainText: string) {
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    enc.encode(plainText),
  );

  const payload = new Uint8Array([
    ...salt,
    ...iv,
    ...new Uint8Array(encrypted),
  ]);

  return btoa(String.fromCharCode(...payload));
}

export async function decryptWithSecret(secret: string, cipherText: string) {
  const data = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const cipher = data.slice(28);

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    cipher,
  );

  return new TextDecoder().decode(decrypted);
}

export function generateRandomValue() {
  const prefix = `qr_${nanoid(6)}`;
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);

  const secretPart = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${prefix}_${secretPart}`;
}

export function generateRandomCode(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
