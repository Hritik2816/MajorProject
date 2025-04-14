const express = require('express')
const router = express.Router()
const User = require('../models/users');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const { userSign, userLogin, userLogout } = require('../controllers/user');

router.get("/signup", (req, res) => {
  res.render("users/signup");
});


router.post("/signup", wrapAsync(userSign));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
})

router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
  userLogin
)


router.get("/logout", userLogout)

module.exports = router