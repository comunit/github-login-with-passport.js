const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const githubPassport = require("./passport/github-auth");

const app = express();
// static files
app.use(express.static("public"));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(
  session({
    secret: "keyboard cat",
    cookie: { path: "/", httpOnly: true, maxAge: 36000000 },
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ensure authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.error = "You must be logged in to access";
  res.redirect("/");
}

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/user");
  }
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

// protected route
// user route
app.get("/user", ensureAuthenticated, (req, res) => {
  res.render("user.twig", { user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// home route
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/user");
  } else {
    res.render("index.twig", { message: req.session.error });
    req.session.destroy();
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));
