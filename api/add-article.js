const app = require("../app");
const route = require("../routes/add-article");

app.use("/api/", route);

module.exports = app;