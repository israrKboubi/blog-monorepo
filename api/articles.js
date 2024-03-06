const app = require("../app");
const route = require("../routes/articles");
const route2 = require("../routes/auth");


app.use("/api/", route);
app.use("/auth/", route2);

module.exports = app;