const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies.jwt;
  return token;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.JWT_SECRET || 'secretKey'
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;