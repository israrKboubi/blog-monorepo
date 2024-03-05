const app = require("../app");
const route = require("../routes/update-article");

app.use("/api/", route);

module.exports = app;