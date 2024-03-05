const routes = require("express").Router();
const articles = require("./articles");

routes.use("/", articles);
module.exports = routes;