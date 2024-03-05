const app = require("../app");
const route = require("../routes/articles");

app.use("/api-articles/", route);

module.exports = app;