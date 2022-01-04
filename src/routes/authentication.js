const { request } = require("express");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

const pool = require("../database");


router.get("/registro", isNotLoggedIn, (req, res) => {
z
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

router.get("/perfil", isLoggedIn, async (req, res) => {
  const  redsocial = await pool.query("select * from usuarioredsocial where dni = ?", [req.user.dni]);
  if (redsocial.linkwsp != ""){
    req.flash("successwsp","Hola");
  }else{
    req.flash("messageswsp","url vacia");
  }
  res.render("perfil", { redsocial: redsocial[0] });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
