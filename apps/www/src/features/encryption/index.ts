import { CompactEncrypt, compactDecrypt } from "jose";

const secret = new TextEncoder().encode(
  import.meta.env.VITE_BETTER_AUTH_SECRET,
);

export async function encryptId(id: string): Promise<string> {
  const token = await new CompactEncrypt(new TextEncoder().encode(id))
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(secret);

  return token;
}

export async function decryptId(token: string): Promise<string> {
  const { plaintext } = await compactDecrypt(token, secret);
  return new TextDecoder().decode(plaintext);
}
