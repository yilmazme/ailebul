const express = require("express");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const User = require("../users");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const { loggedUser } = require("../config/unauth");


//prevent caching...after logout a user can't go back
router.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

//db itteration, find and render all
router.get("/people", (req, res) => {
  User.find({})
    .lean()
    .then((data) => {
      res.render("index", {
        title: "Hayvan Edin | Hepsi",
        people: data,
        style: "index.css",
      });
    })
    .catch((err) => console.log(err));
});

// registeriation's page, loogedUser middleware does not allow looged user to see
router.get("/people/new", loggedUser, (req, res) => {
  res.render("new", {
    title: "Aile Bul | Kayıt",
    style: "../new.css",
  });
});

//this is for registeration
router.post("/people/new", upload.single("animalImage"), (req, res) => {
  const {
    name,
    username,
    password,
    phone,
    region,
    aname,
    age,
    description,
  } = req.body;

  let errorMsg = "";
  if (!name || !username || !password || !phone) {
    errorMsg = "! please fill all required files";
  }
  if (password.length < 6) {
    errorMsg = "! password should be at least 6 characters";
  }
  if (!Number(phone)) {
    errorMsg = "! please provide a valid phone number";
  }
  if (errorMsg) {
    res.render("new", {
      errorMsg,
      name,
      username,
      password,
      phone,
      region,
      aname,
      age,
      description,
      title: "Aile Bul | Kayıt",
      style: "../new.css",
    });
  } else {
    User.findOne({ username: username }).then((user) => {
      //user exist
      if (user) {
        res.render("new", {
          errorMsg: "user exist",
          name,
          username,
          password,
          phone,
          title: "Aile Bul | Kayıt",
          style: "../new.css",
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name: name,
          username: username,
          password: password,
          phone: phone,
          region: req.body.region,
          animal: {
            name: req.body.aname,
            age: req.body.age,
            description: req.body.description,
            animalImage: req.file.path,
          },
        });
        //hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;

            user.password = hash;
            //save user
            user
              .save()
              // .then((result) => {
              //   console.log(result);
              // })
              .catch((err) => console.log(err));
            req.flash(
              "success_msg",
              "registration is successfull, you can login now"
            );
            res.redirect("/people/login");
          })
        );
      }
    });
  }
});

//login page, registered user cant see with help of loggedUser
router.get("/people/login", loggedUser, (req, res) => {
  res.render("login", {
    title: "Aile Bul | Giriş",
    style: "../new.css",
  });
});
//user profile
router.get("/people/registered", ensureAuthenticated, (req, res) => {
  res.render("one", {
    title: "Aile Bul | Sayfam",
    style: "../one.css",
    name: req.user.name,
    username: req.user.username,
    phone: req.user.phone,
    region: req.user.region,
    animal: req.user.animal,
    id: req.user._id,
  });
});

//login handle
router.post("/people/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/people/registered",
    failureRedirect: "/people/login",
    failureFlash: true,
  })(req, res, next);
});

// logout handle
router.get("/people/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "you are logged out");
  res.redirect("/people/login");
});

//page for one
router.get("/people/:id", (req, res) => {
  User.findById(req.params.id)
    .lean()
    .then((data) => {
      res.render("page", {
        title: "Arkadaş Edin | Hepsi",
        people: data,
        style: "../new.css",
      });
    })
    .catch((err) => console.log(err));
});

//delete handle
router.delete("/people/registered/:id", async (req, res) => {
  await User.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.redirect("/people/registered");
    } else {
      req.flash("success_msg", "your account is deleted");
      res.redirect("/people");
    }
  });
});
module.exports = router;
