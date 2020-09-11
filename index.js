if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
require("./passportConfig");
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_LINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(methodOverride("_method"));
app.set("trust proxy", 1);
app.use(cors({ credentials: true, origin: process.env.CLIENT_BASE_URL }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

if (process.env.NODE_ENV === "production") {
  sessionConfig.cookie.sameSite = "none";
  sessionConfig.cookie.secure = "true";
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send({
    GoogleLogin: "http://localhost:5000/auth/google",
    FacebookLogin: "http://localhost:5000/auth/facebook",
  });
});
app.use(require("./routers/auth"));
app.use(require("./routers/payment"));
app.use(require("./routers/product"));

app.listen(process.env.PORT);
