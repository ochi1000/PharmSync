const nodemailer = require("nodemailer");
require('dotenv').config()

const{SMTP_USER, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT} = process.env

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: SMTP_USER, // generated ethereal user
      pass: SMTP_PASSWORD, // generated ethereal password
    },
  });

module.exports = transporter;