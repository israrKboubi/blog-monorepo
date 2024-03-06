const app = require("../app");
const route = require("../routes/auth");

app.use("/auth/", route);

module.exports = app;