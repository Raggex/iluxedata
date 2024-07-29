// CONEXION
const { connection } = require("./connection");

// Función para banear a un usuario
const banearUsuario = (userid) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE Usuarios SET status = ? WHERE userid = ?";
    connection.execute(query, [false, userid], (err, resultados) => {
      if (err) {
        return reject("Error al banear al usuario: " + err.message);
      }
      console.log(`Usuario con ID ${userid} ha sido baneado.`);
      resolve("Usuario baneado correctamente");
    });
  });
};

// Función para quitar el baneo de un usuario
const quitarBaneo = (userid) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE Usuarios SET status = ? WHERE userid = ?";
    connection.execute(query, [true, userid], (err, resultados) => {
      if (err) {
        return reject("Error al quitar el baneo del usuario: " + err.message);
      }
      console.log(`Baneo del usuario con ID ${userid} ha sido eliminado.`);
      resolve("Baneo eliminado correctamente");
    });
  });
};

// Función para verificar el estado de un usuario
const verificarStatus = (userid) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT status FROM Usuarios WHERE userid = ?";
    connection.execute(query, [userid], (error, resultados) => {
      if (error) {
        return reject(
          "Error al verificar el estado del usuario: " + error.message
        );
      }
      if (resultados.length > 0) {
        const status = resultados[0].status;
        resolve({ estatus: true, status });
      } else {
        resolve({ estatus: false, status: null });
      }
    });
  });
};

module.exports = { banearUsuario, verificarStatus, quitarBaneo };
