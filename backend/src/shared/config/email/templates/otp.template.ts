export function otpTemplate(name: string | null, otp: string ) {
  return `
    <div style="font-family: Arial;">
      <h2>Verify your email</h2>
      <p>Hello ${name || "there"},</p>

      <p>Your OTP code is:</p>

      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        background: #f3f3f3;
        padding: 12px;
        display: inline-block;
        border-radius: 8px;
      ">
        ${otp}
      </div>

      <p>This code expires in 5 minutes.</p>
    </div>
  `;
}