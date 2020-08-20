if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({ msg: "hello world" });
});

app.listen(process.env.PORT);
