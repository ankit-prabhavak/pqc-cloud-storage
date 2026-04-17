import transporter from '../config/mailer.js'

export const sendOTPEmail = async (email, name, otp) => {
  await transporter.sendMail({
    from: `"PQC Cloud Storage" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP - PQC Cloud Storage',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Hello, ${name} 👋</h2>
        <p style="color: #555;">Your One-Time Password (OTP) for PQC Cloud Storage is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #555;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">If you did not request this, please ignore this email.</p>
      </div>
    `
  })
}