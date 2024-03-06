const routes = require("express").Router();
const articles = require("./articles");
const auth = require("./auth");


routes.use("/", articles);
routes.use("/", auth);

module.exports = routes;