const app = require("../app");
const route = require("../routes/delete-article");

app.use("/api/", route);

module.exports = app;