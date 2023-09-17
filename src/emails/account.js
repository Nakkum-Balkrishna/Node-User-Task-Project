/**
 * Things to remembed , less secure app not allowed now
 * use 2 step auth then create app password
 * first select mail second select other and use that password 
 * all the very best
 * ref: https://nodemailer.com/
 */

"use strict";
const nodemailer = require("nodemailer");
const {email, password} = require('../emails/creds')

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

async function main() {
 
  const info = await transporter.sendMail({
    from: email, 
    to: "durgudenitesh100@gmail.com", 
    subject: "Krishna testing email send using node js", 
    html: `<p style="color:blue">I have used google auth to do this.</p>`, 
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);

