const app = require("../app");
const route = require("../routes/article");

app.use("/api/", route);

module.exports = app;