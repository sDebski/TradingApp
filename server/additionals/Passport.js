const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

const validateUser = (username, password, done) => {
  User.findOne({username: username}, async (err, user) => {
    if (err) return done(err);
    if (user && await user.isValidPassword(password))
      return done(null, user)
    else return done(null, null);
  })
};

passport.use('local', new LocalStrategy(validateUser));
passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("Bearer"),
    secretOrKey: process.env.APP_SECRET
  }, (jwt_payload, done) => {
    try {
      User.findOne({_id: jwt_payload.id})
        .then(user => {
          if(user){
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
    } catch (err) {
      return done(err);
    }
  })
)

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findOne({"_id": id}, (err, user) => {
    if (err) return done(err);
    if (user) {
      return done(null, {
        id: user._id,
        username: user.username,
        password: user.password
      });
    }
    return done({msg: "Unkown user ID"});
  });
});

module.exports = passport;
