const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("./models/User");

const gStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleUserId: profile.id });
      if (user) {
        done(null, user);
      } else {
        let createdUser = await User.create({
          googleUserId: profile.id,
          googleProfile: profile,
        });
        done(null, createdUser);
      }
    } catch (error) {
      done(error);
    }
  }
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Set up proxy (only require in the servers base in China)
var HttpsProxyAgent = require("https-proxy-agent");
const agent = new HttpsProxyAgent(
  process.env.HTTP_PROXY || "http://127.0.0.1:8001"
);
gStrategy._oauth2.setAgent(agent);

passport.use(gStrategy);
