const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");
const helpers = require("../lib/helpers");
const path = require("path");
const { Console } = require("console");
const { compareSync } = require("bcrypt");







const expresiones = {
  nombre: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
  apellidos: /^[a-zA-ZÀ-ÿ\s]{0,50}$/,
  password: /^.{4,10}$/,
  correo: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  direccion: /^[a-zA-ZÀ-ÿ0-9.#-_\s]{0,100}$/,
  celular: /^[0-9]{9}$/,
  usuario: /^[a-zA-Z0-9-_]{4,12}$/,
};

router.get("/publicar", isLoggedIn, async (req, res) => {
  const genero = await pool.query("SELECT * FROM genero");
  const especie = await pool.query("SELECT * FROM especie");

  res.render("links/publicar", { genero, especie});

});




router.post("/publicar", isLoggedIn, async (req, res) => {

  const {
    titulo,
    fechasubida,
    descripcion,
    stock = 1,
    precio,
    autor,
    estado = 1,
    idGenero ,
    idEspecie,
    url,
  } = req.body;


  

  const nuevoLibro = {
    titulo,
    fechasubida,
    descripcion,
    stock,
    precio,
    autor,
    estado,
    idGenero,
    idEspecie,
    dni: req.user.dni,
    url
  };


  
  await pool.query("INSERT INTO LIBRO SET ?", [nuevoLibro]);
  req.flash("success", "Libro guardado satisfactoriamente");
  res.redirect("/links/mislibros");

});

router.get("/mislibros", isLoggedIn, async (req, res) => {


  const libro = await pool.query(
    "SELECT * FROM LIBRO WHERE ESTADO=1 and dni = ?",
    [req.user.dni]
  );

  res.render("links/mislibros", { libro });
});

router.get("/change/:idLibro", isLoggedIn, async (req, res) => {
  const { idLibro } = req.params;
  await pool.query("update libro set estado = 2 where idLibro=? and dni=?", [
    idLibro,
    req.user.dni,
  ]);
  req.flash("success", "El libro ha sido desactivado");
  res.redirect("/links/mislibros");
});

router.get("/editbook/:idLibro", isLoggedIn, async (req, res) => {
  const { idLibro } = req.params;
  const libro = await pool.query(
    "select*from libro where idLibro=? and dni=?",
    [idLibro, req.user.dni]
  );
  res.render("links/editbook", { editbook: libro[0] });
});


router.get("/deletebook/:idLibro", isLoggedIn, async (req, res) => {
  const { idLibro } = req.params;
  await pool.query("delete from libro where idLibro = ?",[idLibro]);
  res.redirect("/links/mislibros");   
});


router.post("/editbook/:idLibro", isLoggedIn, async (req, res) => {
  const { idLibro } = req.params;
  const { titulo, descripcion, stock, precio, autor } = req.body;
  const actLibro = {
    titulo,
    descripcion,
    stock,
    precio,
    autor,
  };
  console.log(actLibro);
  await pool.query("update libro set ? where idLibro = ?", [actLibro, idLibro]);
  req.flash("success", "Libro actualizado satisfactoriamente");
  res.redirect("/links/mislibros");
});

router.get("/edituser/datos/:dni", isLoggedIn, async (req, res) => {
  const { dni } = req.params;
  const user = await pool.query("select*from persona where dni=?", [dni]);
  const distrito = await pool.query(
    "select id_distrito, des_distrito from distrito"
  );
  res.render("links/modificarperfil", { edituser: user[0], distrito });
});

router.post("/edituser/datos/:dni", isLoggedIn, async (req, res) => {

  try {

    const { dni } = req.params;

  

    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      direccion,
      telefono,
      correo_electronico,
      genero,
      fecha_nac,
      usuario,
      id_distrito,
      wsp,
      twt,
      ig,
      fb,
      wtp,
      url
    } = req.body;

    

   

    
      await pool.query(
        "update persona set nombre=?,apellidoPaterno=?,apellidoMaterno=?,direccion=?,telefono=?,correo_electronico=?,genero=?,usuario=?,fecha_nac=?, foto = ? ,id_distrito=? where dni = ?",
        [
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          direccion,
          telefono,
          correo_electronico,
          genero,
          usuario,
          fecha_nac,
          url,
          id_distrito,
          dni,
        ]
      );

      await pool.query(
        "update usuarioredsocial set link_wsp=?,link_fb=?,link_twt=?,link_ig=?,link_wtp=? where dni = ?",
        [wsp, twt, ig, fb, wtp, dni]
      );

      req.flash("success", "Datos actualizados satisfactoriamente");
    

    res.redirect(dni);

  } catch{
    req.flash("message", "Error en algunos de los campos");
  }
  
});

router.post("/edituser/contra/:dni", isLoggedIn, async (req, res) => {
  const { dni } = req.params;
  const { contraActual, contraNueva, contraConfirmar } = req.body;

  const row = await pool.query("SELECT * FROM persona WHERE dni=?", [dni]);

  const user = row[0];

  const validarPassword = await helpers.comparaPassword(
    contraActual,
    user.password
  );

  if (validarPassword) {
    if (expresiones.password.test(contraNueva)) {
      if (contraNueva === contraConfirmar) {
        /* const contraEncriptada = await helpers.encryptPassword(contraNueva);
        await pool.query("UPDATE persona SET password=? WHERE dni=?", [
          contraEncriptada,
          dni,
        ]);
        console.log(contraEncriptada); */
        req.flash("success", "Contraseña actualizada satisfactoriamente");
        console.log("Exito");
      } else {
        req.flash("message", "Las contraseñas no son iguales");
        console.log("Las contraseñas no son iguales");
      }
    } else {
      req.flash("message", "Error en los campos");
      console.log("Error en los campos");
    }
  } else {
    req.flash("message", "La contraseña actual no coincide");
    console.log("La contraseña actual no coincide");
  }

  res.redirect("back");
});

router.post("/buscar", isLoggedIn, async (req, res) => {
 
  const { libro } = req.body;

  const libros= await pool.query("SELECT * FROM libro WHERE titulo=?", [libro]);
  console.log(libros);

  res.render("links/buscar", {libros});

  
  req.flash("success", "Libro encontrado");
  
  
});

router.get("/buscar", isLoggedIn, (req, res) => {
  
  res.render("links/buscar");
  
  
});

router.get("/verlibros", isLoggedIn, async (req, res) => {

  const genero = await pool.query(
    "SELECT * FROM genero"
  );

  

  const libro = await pool.query(
    "SELECT * FROM LIBRO"
  );

  res.render("links/verlibros", { libro , genero});
 


  
  
});

router.post("/verlibros", isLoggedIn, async (req, res) => {

  const {Genero} = req.body


  const genero = await pool.query(
    "SELECT * FROM genero"
  );



  const libro = await pool.query(
    "SELECT * FROM LIBRO WHERE idGenero = ?", [Genero]
  );

  res.render("links/verlibros", { libro, genero});

  
});




module.exports = router;