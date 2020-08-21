const router = require("express").Router();
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/secret");
  }
);

router.get("/secret", (req, res) => {
  res.send("You have logged in");
});

module.exports = router;
