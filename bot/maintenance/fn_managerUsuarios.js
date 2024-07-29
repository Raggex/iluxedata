const { connection } = require("../../../sql/connection");

// Función para verificar si un usuario tiene suficientes créditos
async function verificarCreditos(userid, creditosNecesarios) {
  try {
    const [rows] = await connection.execute(
      "SELECT creditos FROM usuarios WHERE userid = ?",
      [userid]
    );
    if (rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }
    return rows[0].creditos >= creditosNecesarios;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Función para agregar créditos a un usuario
async function agregarCreditos(userid, creditos) {
  try {
    const [result] = await connection.execute(
      "UPDATE usuarios SET creditos = creditos + ? WHERE userid = ?",
      [creditos, userid]
    );
    if (result.affectedRows > 0) {
      console.log("Créditos añadidos correctamente");
      return true;
    } else {
      console.log("No se pudo agregar créditos");
      return false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Función para restar créditos de un usuario
async function restarCreditos(userid, creditos) {
  try {
    const [result] = await connection.execute(
      "UPDATE usuarios SET creditos = creditos - ? WHERE userid = ? AND creditos >= ?",
      [creditos, userid, creditos]
    );
    if (result.affectedRows > 0) {
      console.log("Créditos descontados correctamente");
      return true;
    } else {
      console.log("No se pudo descontar créditos");
      return false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  verificarCreditos,
  agregarCreditos,
  restarCreditos,
};
