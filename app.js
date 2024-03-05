const express = require('express');
const cors = require('cors');
const path = require('path');
require("dotenv").config({path:"./.env"});

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
