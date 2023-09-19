/**
 * Things to remembed , less secure app not allowed now
 * use 2 step auth then create app password
 * first select mail second select other and use that password
 * all the very best
 * ref: https://nodemailer.com/
 */

"use strict";
const nodemailer          =   require("nodemailer");

const email = process.env.FROM_EMAIL
const password = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: email,
    pass: password, // this is app password
  },
});

const sendWelcomeEmail = (toEmail, name) => {
  transporter.sendMail({
    from: email,
    to: toEmail,
    subject: "Thanks for joining in!",
    html: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
}

const sendCancellationEmail = (toEmail, name) => {
  transporter.sendMail({
    from : email,
    to: toEmail,
    subject: "Thanks for choosing the services!",
    text: `Hello, ${name}. Is there anything we could have done to stop from using our services, we really would like to here from you.
    \nThank you.
    `,
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}
