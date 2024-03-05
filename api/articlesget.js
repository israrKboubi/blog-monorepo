const app = require("../app");
const route = require("../routes/articlesget");

app.use("/api/", route);

module.exports = app;