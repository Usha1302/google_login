const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

// Session setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: "494503795879-dlgg32ceqvlgpqo7d3bj0gcqbdouko9i.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Routes

// Login route
app.get("/login", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

// Google authentication route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after Google authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

// Profile page after successful authentication
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    const profile = req.user;
    res.send(`
      <h1>Hello, ${profile.displayName}</h1>
      <img src="${profile.photos[0].value}" alt="Profile Picture">
      <a href="/logout">Logout</a>
    `);
  } else {
    res.redirect("/login");
  }
});

// Logout route
// Logout route
// Logout route
app.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error(err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
        }
        res.redirect("/login");
      });
    });
  });
  

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
