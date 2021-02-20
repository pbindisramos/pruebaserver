const Paciente = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

exports.autenticarUsuario = async (req, res, next) => {
  //Revisar si hay errores
  //Buscar Usuario
  const { email, password } = req.body;
  const usuario = await Paciente.findOne({ email });
  //console.log(usuario);

  if (!usuario) {
    res.status(401).json({ msg: "El usuario no existe" });
    return next();
  }

  //verificar password y autenticar
  if (bcrypt.compareSync(password, usuario.password)) {
    console.log("password correcto");
    //crear json web token
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
      process.env.SECRETA,
      {
        expiresIn: "8h",
      }
    );
    console.log(token);
    res.json({ token });
  } else {
    res.status(401).json({ msg: "Password incorrecto" });
    return next();
  }
};

exports.usuarioAutenticado = async (req, res, next) => {
  res.json({ usuario: req.usuario });
  return next();
};
