import { CLIENT_URL } from "../../env";

export function invitationTemplate(orgName: string, token: string) {


  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2>You've been invited!</h2>
      <p>Hello there,</p>
      
      <p>You have been explicitly invited to join the <strong>${orgName}</strong> workspace on NEXUS CRM.</p>
      
      <p>Click the button below to complete your registration setup and accept your invitation access keys:</p>
      
      <div style="margin: 24px 0;">
        <a href="${CLIENT_URL}/invitation/accept?token=${token}" style="
          background-color: #0070f3;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 6px;
          display: inline-block;
        ">
          Accept Invitation & Join Workspace
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666;">
        This workspace registration link will expire automatically in 48 hours.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 32px;" />
      <p style="font-size: 12px; color: #999;">
        If you weren't expecting this invitation, you can safely ignore this email.
      </p>
    </div>
  `;
}