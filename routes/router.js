const routes = require("express").Router();
const articles = require("./articles");
const auth = require("./auth");

routes.use("/", articles);
routes.use("/auth", auth);
routes.get("/", async function (req, res) {
    res.send(`<h1>Reached home!</h1> 
              <br>
              <a href='/books'>Books</a>`);
  });
console.log(routes)
module.exports = routes;