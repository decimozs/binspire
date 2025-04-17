import nodemailer from "nodemailer";
import env from "@config/env.server";

const transporter = nodemailer.createTransport({
  host: env?.GMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: env?.GMAIL_USER,
    pass: env?.GMAIL_PASS,
  },
});

const email = transporter;

export { email };
