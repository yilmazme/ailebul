const express = require("express");
require("dotenv").config();
const path = require("path");
const exphbs = require("express-handlebars");
const useRouter = require("./routes/people");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

const app = express();

//pass configuration
require("./config/passport")(passport);

const password = process.env.MY_PASSWORD;

app.engine(
  "handlebars",
  exphbs({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));

//exp session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
//passp middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash

app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//override middleware
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

//do  not hardcode your connection string, use procces env!!!
const MONGODB_URI = process.env.DATABASE_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("db connected");
});

app.use("/", useRouter);
app.get("*", (req, res) => {
  res.send("<h4>Page Does Not Eexist</h4>");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app started at port ${port}`);
});
