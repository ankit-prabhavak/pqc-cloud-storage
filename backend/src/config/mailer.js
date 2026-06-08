import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// VERIFY SMTP CONNECTION
transporter.verify((error, success) => {

  if (error) {
    console.log('MAILER ERROR:')
    console.log(error)
  }

  else {
    console.log('Mailer ready')
  }

})

export default transporter