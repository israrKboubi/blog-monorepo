const routes = require("express").Router();
const articles = require("./articles");
const articleAdd = require("./add-article");
const articleDelete = require("./delete-article");
const articleUpdate = require("./update-article");

routes.use("/", articles);
routes.use("/", articleAdd);
routes.use("/", articleDelete);
routes.use("/", articleUpdate);
module.exports = routes;