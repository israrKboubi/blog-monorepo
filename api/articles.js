const app = require("../app");
const route = require("../routes/articles");

app.use("/api/", route);

module.exports = app;