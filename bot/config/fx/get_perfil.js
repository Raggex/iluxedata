const { promisePool } = require("../../../sql/connection"); // Asegúrate de importar el pool de conexiones

// Función para obtener los datos del perfil de un usuario
async function obtenerPerfil(usuarioId) {
  if (typeof usuarioId === "undefined") {
    throw new Error("El userid no está definido");
  }

  try {
    // Ejecuta la consulta usando el pool de conexiones
    const [rows] = await promisePool.query(
      "SELECT userid, nombre, fecha_registro, status, rango, creditos FROM usuarios WHERE userid = ?",
      [usuarioId]
    );

    // Verifica si se encontraron resultados
    if (rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    // Retorna los datos del perfil del usuario
    return rows[0];
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    throw error; // Propaga el error para manejarlo en el lugar de llamada
  }
}

module.exports = { obtenerPerfil };
