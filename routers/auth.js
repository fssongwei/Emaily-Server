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
  res.status(200).send({ msg: "Log out success!" });
});

router.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send(req.user._doc);
  } else {
    res.status(401).send({ msg: "User is not login!" });
  }
});

module.exports = router;
