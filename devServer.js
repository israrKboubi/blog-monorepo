const app = require("./app");
const routes = require("./routes/router");

app.use("/", routes);

app.listen(3000,function () {
    console.log("Server started. Go to f http://localhost:3000/");
});