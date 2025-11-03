import { rpc } from "../lib/api-client";

export interface SendInviteData {
  email: string;
  role: string;
  permission: string;
}

export class EmailApi {
  static async sendInvite(data: SendInviteData) {
    const response = await rpc.api.emails["send-invitation"].$post({
      json: { ...data },
    });

    if (!response.ok) throw new Error("Failed to send invitation email");

    return response;
  }
}
