import { TRASHBIN_CONFIG } from "@binspire/shared";
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

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

function getWasteLevelKey(value: number) {
  if (value >= TRASHBIN_CONFIG["waste-level"].overflowing.value)
    return "overflowing";
  if (value >= TRASHBIN_CONFIG["waste-level"].full.value) return "full";
  if (value >= TRASHBIN_CONFIG["waste-level"]["almost-full"].value)
    return "almost-full";
  if (value >= TRASHBIN_CONFIG["waste-level"].low.value) return "low";
  return "empty";
}

function getWeightLevelKey(value: number) {
  if (value >= TRASHBIN_CONFIG["weight-level"].overloaded.value)
    return "overloaded";
  if (value >= TRASHBIN_CONFIG["weight-level"].heavy.value) return "heavy";
  if (value >= TRASHBIN_CONFIG["weight-level"].medium.value) return "medium";
  return "light";
}

function getBatteryLevelKey(value: number) {
  if (value >= TRASHBIN_CONFIG["battery-level"].full.value) return "full";
  if (value >= TRASHBIN_CONFIG["battery-level"].medium.value) return "medium";
  if (value >= TRASHBIN_CONFIG["battery-level"].low.value) return "low";
  return "critical";
}

function getSolarPowerLevelKey(value: number) {
  if (value >= TRASHBIN_CONFIG["solar-power"].full.value) return "full";
  if (value >= TRASHBIN_CONFIG["solar-power"].high.value) return "high";
  if (value >= TRASHBIN_CONFIG["solar-power"].medium.value) return "medium";
  if (value >= TRASHBIN_CONFIG["solar-power"].low.value) return "low";
  return "none";
}

export function getColor(type: keyof typeof TRASHBIN_CONFIG, value: number) {
  let levelKey: string;

  switch (type) {
    case "waste-level":
      levelKey = getWasteLevelKey(value);
      break;
    case "weight-level":
      levelKey = getWeightLevelKey(value);
      break;
    case "battery-level":
      levelKey = getBatteryLevelKey(value);
      break;
    case "solar-power":
      levelKey = getSolarPowerLevelKey(value);
      break;
    default:
      levelKey = "empty";
  }

  return (TRASHBIN_CONFIG[type] as any)[levelKey].color;
}
