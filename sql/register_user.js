const { promisePool } = require("./connection");

// Función para registrar un nuevo usuario
const registrarUsuario = (userid, nombre) => {
  const query = "INSERT INTO usuarios (userid, nombre, rango, creditos) VALUES (?, ?, 'FREE', 3)";
  return promisePool.execute(query, [userid, nombre])
    .then(() => {
      console.log(`Usuario ${nombre}, con el ID ${userid} registrado correctamente con 3 créditos.`);
      return "Usuario registrado correctamente con 3 créditos";
    })
    .catch(err => {
      throw new Error("Error registrando usuario: " + err.message);
    });
};

// Función para verificar si un usuario ya está registrado y devolver la fecha de registro
const verificarRegistro = (userid) => {
  const query = "SELECT fecha_registro FROM usuarios WHERE userid = ?";
  return promisePool.execute(query, [userid])
    .then(([resultados]) => {
      if (resultados.length > 0) {
        return { estatus: true, date: resultados[0].fecha_registro };
      } else {
        return { estatus: false };
      }
    })
    .catch(err => {
      throw new Error("Error al verificar el registro: " + err.message);
    });
};

module.exports = { registrarUsuario, verificarRegistro };
