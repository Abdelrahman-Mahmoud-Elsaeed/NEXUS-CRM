import { CLIENT_URL } from "../../env";



export function resetPasswordTemplate(name: string  | null , token:string) {
  return `
    <div style="font-family: Arial;">
      <h2>Reset your password</h2>

      <p>Hello ${name || "there"},</p>

      <p>You requested to reset your password.</p>

      <a href="${CLIENT_URL}/reset-password/${token}" style="
        display:inline-block;
        padding:10px 16px;
        background:#000;
        color:#fff;
        text-decoration:none;
        border-radius:6px;
      ">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>

      <p>If you didn’t request this, ignore this email.</p>
    </div>
  `;
}