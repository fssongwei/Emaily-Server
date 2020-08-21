if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const passport = require("passport");
require("./passportConfig");

app.get("/", (req, res) => {
  res.send("<a href='http://localhost:5000/auth/google'>login</a>");
});

app.use(require("./routers/auth"));

app.listen(process.env.PORT);
