import { email as nodemailer } from "@/lib/email";
import type { MailOptions } from "nodemailer/lib/json-transport";

export async function sendEmail(options: MailOptions) {
  try {
    await nodemailer.sendMail(options);
    return {
      success: true,
    };
  } catch (error) {
    return {
      errors: "Failed to send email verification",
    };
  }
}
