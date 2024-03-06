const app = require("../app");
const route = require("../routes/articles");
const route = require("../routes/auth");


app.use("/api/", route);
app.use("/auth/", route);

module.exports = app;