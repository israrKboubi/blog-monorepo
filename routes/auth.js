var utils = require('../app/utils');

const nodemailer = require('nodemailer');
let adminToken = null;
let tokenTimestamp = null;
const tokenValidityDuration = 1 * 60 * 60 * 1000;
const auth = require("express").Router();

auth.get('/auth', (req, res) => {
  const randomString = utils.generateRandomString();
  adminToken = randomString;
  tokenTimestamp = Date.now();
  sendEmail('kouiisrar@gmail.com', 'Admin Token', adminToken).then(()=>{
    res.json({ message: 'Random string generated and sent to admin email.' });
  })
});

async function sendEmail(toEmail, subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: 'kouiisrar@gmail.com',
      pass: process.env.EMAILPASS || 'wnzh wmnp ulif vguj'
    }
  });

  const mailOptions = {
    from: 'kouiisrar@gmail.com',
    to: toEmail,
    subject: subject,
    text: message
  };
  await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject('Error sending email:', error);
            } else {
                resolve('Email sent:', info.response);
            }
        });
    });
}


auth.post('/auth', (req, res) => {
  const { token } = req.body.password;
  if (adminToken && isTokenValid() && req.body.password === adminToken) {
    res.json({ verified: true });
  } else {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});


function isTokenValid() {
  if (tokenTimestamp) {
    const currentTime = Date.now();
    return currentTime - tokenTimestamp <= tokenValidityDuration;
  }
  return false;
}

auth.delete('/auth', (req, res) => {
  killtoken();
  res.json({ signout: true });
});

function killtoken() {
  let adminToken = null;
  let tokenTimestamp = null;
}

module.exports=auth;