const express = require('express')
const router = express.Router()
const User = require('../models/users');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get("/signup", (req, res) => {
  res.render("users/signup");
});


router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { email, password, username } = req.body
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password)
    console.log(registerUser);
    req.flash("success", "Welcome to the Wanderlust")
    res.redirect("/listing");

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
})
)

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
})

router.post("/login",
  passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect("/listing")
  })

module.exports = router