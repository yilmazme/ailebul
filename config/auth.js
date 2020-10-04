module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Giriş Yapmanız Lazım");
    res.redirect("/people/login");
  },
};
