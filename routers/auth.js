const router = require("express").Router();
const passport = require("passport");

// Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_BASE_URL}`);
  }
);

// Facebook OAuth
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_BASE_URL}`);
  }
);

// Logout
router.get("/auth/logout", (req, res) => {
  req.logOut();
  res.send({ isLogin: false });
});

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ isLogin: true, ...req.user._doc });
  } else {
    res.send({ isLogin: false });
  }
});

module.exports = router;
