const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

export const sendEmail = async ({ to, subject, html, headers }) => {
  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: 'XORS',
        email: process.env.EMAIL_FROM,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      headers,
    }),
  })

  console.log(process.env.BREVO_API_KEY);

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Brevo send failed: ${res.status} ${errorBody}`)
  }

  return res.json()
}

export default sendEmail