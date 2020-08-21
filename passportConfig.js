const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const gStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    done(null, profile);
  }
);

passport.use(gStrategy);
