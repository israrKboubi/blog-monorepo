const routes = require("express").Router();
const articles = require("./articles");
const articlesGet = require("./articlesget");

routes.use("/", articles);
routes.use("/get", articlesGet);
//routes.use("/", articleDelete);
//routes.use("/", articleUpdate);
module.exports = routes;