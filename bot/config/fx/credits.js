const { promisePool } = require("../../../sql/connection");

// Función para verificar si un usuario tiene suficientes créditos
async function verificarCreditos(userid, creditosNecesarios) {
  try {
    const [rows] = await promisePool
      .execute("SELECT creditos FROM usuarios WHERE userid = ?", [userid]);
    if (rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }
    return rows[0].creditos >= creditosNecesarios;
  } catch (error) {
    console.error("Error al verificar créditos:", error);
    throw error;
  }
}

// Función para agregar créditos a un usuario
async function agregarCreditos(userid, creditos) {
  try {
    const [result] = await promisePool
      .execute(
        "UPDATE usuarios SET creditos = IFNULL(creditos, 0) + ? WHERE userid = ?",
        [creditos, userid]
      );

    // Verifica el resultado
    if (result.affectedRows > 0) {
      console.log("Créditos añadidos correctamente");
      return true;
    } else {
      console.log("No se pudo añadir créditos");
      return false;
    }
  } catch (error) {
    console.error("Error al agregar créditos:", error);
    throw error;
  }
}

// Función para restar créditos de un usuario
async function restarCreditos(userid, creditos) {
  try {
    const [result] = await promisePool
      .execute(
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
    console.error("Error al descontar créditos:", error);
    throw error;
  }
}

// Función para obtener el número de créditos de un usuario
async function obtenerCreditos(userid) {
  try {
    // Ejecuta la consulta para obtener los créditos del usuario
    const [rows] = await promisePool
      .execute("SELECT creditos FROM usuarios WHERE userid = ?", [userid]);

    // Verifica si se encontró el usuario
    if (rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    // Devuelve el número de créditos del usuario
    return rows[0].creditos;
  } catch (error) {
    console.error("Error al obtener créditos:", error);
    throw error;
  }
}

module.exports = {
  verificarCreditos,
  agregarCreditos,
  restarCreditos,
  obtenerCreditos,
};
