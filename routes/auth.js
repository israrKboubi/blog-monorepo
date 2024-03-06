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
  sendEmail('kouiisrar@gmail.com', 'Admin Token', adminToken);
  res.json({ message: 'Random string generated and sent to admin email.' });
});

function sendEmail(toEmail, subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


auth.post('/auth/verify', (req, res) => {
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

auth.get('/auth/signout', (req, res) => {
  killtoken();
  res.json({ signout: true });
});

function killtoken() {
  let adminToken = null;
  let tokenTimestamp = null;
}

module.exports=auth;