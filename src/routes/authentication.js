const { request } = require("express");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/registro", isNotLoggedIn, (req, res) => {
  console.log("Dsadasd")
  res.render("auth/registro");
});

router.post(
  "/registro",
  isNotLoggedIn,
  passport.authenticate("local.registro", {
    successRedirect: "/login",
    failureRedirect: "/registro",
    failureFlash: true,
  })
);

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("auth/login");
  

});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local.login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/perfil", isLoggedIn, (req, res) => {
  res.render("perfil");
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
