if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
require("./passportConfig");
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_LINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send({ login: "http://localhost:5000/auth/google" });
});
app.use(require("./routers/auth"));

app.listen(process.env.PORT);
