const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel")
const passport = require("passport");
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1022337633689-9jfd22rmg7igin20mg64opkum6dfvg1i.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
  
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOrCreateUser(profile);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
