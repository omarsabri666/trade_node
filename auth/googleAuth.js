var GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const passport = require("passport");
const { generateToken, generateRefreshToken } = require("../utils/jwt");
const { addRefreshToken } = require("../models/refreshTokenModel");
passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOrCreateUser(profile);
        const token = generateToken({ id: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id });
        await addRefreshToken(
          user.id,
          refreshToken,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        return done(null, { user, token, refreshToken });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
