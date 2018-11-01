//passport stragety
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
githubPassport = passport.use(
  new GitHubStrategy(
    {
      clientID: "72e4a72dbd836ed28c55",
      clientSecret: "46ab145916c989b3577b8dfb9620a39b5398f762",
      callbackURL: "http://localhost:5000/callback"
    },
    function(accessToken, refreshToken, user, cb) {
      return cb(null, user);
    }
  )
);
