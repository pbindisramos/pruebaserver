const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoUsuario = async (req, res) => {
  //express validator
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Verificación Usuario registrado

  const { email, password } = req.body;

  let usuario = await Usuario.findOne({ email });
  if (usuario) {
    return res
      .status(400)
      .json({ msg: "El correo ya se encuentra registrado" });
  }

  //crear nuevo usuario
  usuario = new Usuario(req.body);

  //hashear password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  try {
    await usuario.save();
    res.json({ msg: "Usuario creado correctamente" });
  } catch (error) {
    console.log(error);
  }
};
