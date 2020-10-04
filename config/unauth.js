module.exports = {
  loggedUser: function (req, res, next) {
    if (req.isAuthenticated()) {
      req.flash("error_msg", "Halihazırda giriş yapmışsınız zaten");
      res.redirect("/people/registered");
    } else {
      next();
    }
  },
};
