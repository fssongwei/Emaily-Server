const router = require("express").Router();
const passport = require("passport");

// Google OAuth
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

// Facebook OAuth
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/secret");
  }
);

// Logout
router.get("/auth/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.get("/secret", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      //   "You have logged in, click <a href='/auth/logout'>here</a> to log out"
      { ...req.user, logOut: "http://localhost:5000/auth/logout" }
    );
  } else {
    res.redirect("/");
  }
});

module.exports = router;
