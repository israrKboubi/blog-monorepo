
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
require("dotenv").config({path:"./.env"});
const crypto = require('crypto');


const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports={
  app:app,
  multer:require('multer'),
  path:path,
  fs:require('fs'),
  baseUrl:process.env.BACKHOST || "https://dockerhub-israr-blog.onrender.com",
  port:port,
  crypto:crypto
}
