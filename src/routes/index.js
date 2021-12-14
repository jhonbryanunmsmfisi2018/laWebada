const express = require("express");
const router = express.Router();
const pool = require("../database");
const path = require("path");
const { isLoggedIn } = require("../lib/auth");

const expresiones = {
  correo: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  usuario: /^[a-zA-Z0-9-_]{4,12}$/,
};

router.get("/", async (req, res) => {
  
  const genero = await pool.query("SELECT nombre FROM genero");

  console.log("asdasd") 
  res.render("index", { genero });
});

router.get("/ayuda", async (req, res) => {
  const genero = await pool.query("SELECT nombre FROM genero");
  res.render("ayuda", { genero });
});

router.get("/denunciar", async (req, res) => {
  const genero = await pool.query("SELECT nombre FROM genero");
  res.render("denunciar", { genero });
});

router.post("/ayuda", isLoggedIn, async(req, res)=>{
  try{
    const {titulo, mensaje} = req.body;
    const nuevaAyuda = {titulo, correo_electronico : req.user.correo_electronico, mensaje, dni : req.user.dni};
    const inst = await pool.query("insert into ayuda set ?", [nuevaAyuda]);
    req.flash("success", "Mensaje de ayuda enviado al administrador");
    console.log('a');
  }catch(Exception){
    req.flash("message", "No se pudo recepcionar su ayuda. Revise los datos ingresados.");
    console.log('b');
  }
  res.redirect("/ayuda");
});

router.post("/denunciar", async (req, res) => {
  const { usuario, razon: descripcion } = req.body;

  if (
    req.files &&
    Object.keys(req.files).length != 0 &&
    (expresiones.usuario.test(usuario) || expresiones.correo.test(usuario))
  ) {
    const row = await pool.query(
      "select * from persona where usuario = ? or correo_electronico = ?",
      [usuario, usuario]
    );

    if (row.length > 0) {
      const dni = row[0].dni;
      const archivo = req.files.formFile;
      const archivoUbicación = path.join(
        __dirname,
        "../",
        "files",
        archivo.name
      );

      archivo.mv(archivoUbicación, async () => {
        await pool.query(
          "INSERT INTO denuncia (descripcion,archivo,dni,estado) VALUES (?,?,?,1)",
          [descripcion, archivo.name, dni]
        );
      });

      req.flash("success", "Se registro correctamente tu denuncia");
    } else {
      req.flash(
        "message",
        "No existe el usuario o correo electrónico a denunciar"
      );
    }
  } else {
    req.flash("message", "Error en algunos de los campos");
  }

  res.redirect("/denunciar");
});

module.exports = router;
