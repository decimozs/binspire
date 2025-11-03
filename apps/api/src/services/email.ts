import z from "zod";
import { nanoid } from "nanoid";
import { UserInvitationService } from "./user";
import { VerificationService } from "./verification";
import { encryptId } from "@/features/encryption";
import { resend } from "@/features/email";
import { OrganizationService } from "./org";

export const sendEmailSchema = z.object({
  to: z.string().email({ message: "Recipient email is invalid" }),
  subject: z.string().optional(),
  text: z.string().optional(),
  html: z.string().optional(),
});

export type SendEmailArgs = z.infer<typeof sendEmailSchema>;

interface SendInvitationEmailData {
  email: string;
  role: string;
  permission: string;
}

interface IEmailService {
  sendEmail: (args: SendEmailArgs) => Promise<any>;
  sendInvitationEmail: (
    orgId: string,
    data: SendInvitationEmailData,
    userId: string,
  ) => Promise<any>;
}

export class EmailService implements IEmailService {
  private resend = resend;
  private userInvitationService = new UserInvitationService();
  private orgService = new OrganizationService();
  private verificationService = new VerificationService();

  async sendEmail(args: SendEmailArgs) {
    const { to, subject, text, html } = args;

    const info = await this.resend.emails.send({
      from: "Binspire Support Team <noreply@notifications.binspire.space>",
      to,
      subject: subject ?? "No subject",
      text,
      html,
      react: undefined,
    });

    return info;
  }

  async sendRequestDemoEmail(email: string) {
    const info = await this.resend.emails.send({
      from: "Binspire Support Team <noreply@notifications.binspire.space>",
      to: email,
      subject: "Request for Demo",
      html: "<p>Thank you for your interest in Binspire! We will get back to you shortly to schedule a demo.</p>",
      react: undefined,
    });

    return info;
  }

  async sendNewsletterEmail(email: string) {
    const info = await this.resend.emails.send({
      from: "Binspire Support Team <noreply@notifications.binspire.space>",
      to: email,
      subject: "Binspire Newsletter",
      html: "<p>Thank you for subscribing to the Binspire newsletter! Stay tuned for updates.</p>",
      react: undefined,
    });

    return info;
  }

  async sendInvitationEmail(
    orgId: string,
    data: SendInvitationEmailData,
    userId: string,
  ) {
    const generatedId = nanoid(24);

    const createVerification = await this.verificationService.create({
      identifier: "invitation",
      value: generatedId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const encryptedToken = await encryptId(createVerification.value);
    const createUserInvitation = await this.userInvitationService.create(
      {
        userId,
        orgId,
        ...data,
      },
      userId,
    );
    const encryptedId = await encryptId(createUserInvitation.id);
    const isDev = process.env.NODE_ENV === "development";
    const newBaseUrl = isDev
      ? "http://localhost:5173/invitation"
      : "https://www.binspire.space/invitation";
    const org = await this.orgService.findById(orgId);

    const info = await this.resend.emails.send({
      from: `${org.name} Binspire <noreply@notifications.binspire.space>`,
      to: data.email,
      subject: "You're Invited!",
      html: `
        <p>You have been invited to join our platform. Click the link below to accept the invitation.</p>
        <a href="${newBaseUrl}?id=${encodeURIComponent(encryptedId)}&token=${encodeURIComponent(encryptedToken)}">
          Accept Invitation
        </a>
      `,
    });

    return info;
  }
}
