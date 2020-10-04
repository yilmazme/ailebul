const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//user load

const user = require("../users");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        user
          .findOne({ username: username })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "Kullanıcı İsmi Yanlış!",
              });
            }
            //compare password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Yanlış Şifre!" });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    user.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
