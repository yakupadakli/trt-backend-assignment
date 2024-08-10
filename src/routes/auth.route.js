const passport = require('passport');
const { Router } = require('express');
const config = require('../config')();

const { getGoogleUserToken } = require('../controllers/auth.controller');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = Router();

// Serialize and Deserialize User
// istanbul ignore next
passport.serializeUser((user, done) => {
  done(null, user);
});

// istanbul ignore next
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.redirectUri,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/redirect',
  passport.authenticate('google', { failureRedirect: '/' }),
  getGoogleUserToken,
);

module.exports = router;
