const moment = require('moment-timezone');
const { promisePool } = require("../../../sql/connection");

// Función para obtener los datos del perfil de un usuario
async function obtenerPerfil(usuarioId) {
  if (typeof usuarioId === "undefined") {
    throw new Error("El userid no está definido");
  }

  try {
    // Ejecuta la consulta para obtener los datos del perfil del usuario
    const [usuarioRows] = await promisePool.query(
      "SELECT userid, nombre, fecha_registro, status, rango, creditos, rol, PLAN FROM usuarios WHERE userid = ?",
      [usuarioId]
    );

    // Verifica si se encontraron resultados del perfil
    if (usuarioRows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    // Ejecuta la consulta para obtener las estadísticas de consultas
    const [consultasRows] = await promisePool.query(
      "SELECT consultas_totales, consultas_del_dia FROM consultas WHERE userid = ?",
      [usuarioId]
    );

    // Verifica si se encontraron resultados de las consultas
    if (consultasRows.length === 0) {
      throw new Error("Estadísticas de consultas no encontradas");
    }

    // Combina los resultados del perfil con las estadísticas de consultas
    const perfil = usuarioRows[0];
    const consultas = consultasRows[0];

    // Formatea la fecha en la zona horaria de Perú (UTC-5)
    const fechaRegistro = moment(perfil.fecha_registro)
      .tz('America/Lima') // Ajusta la zona horaria
      .format('DD/MM/YYYY - HH:mm:ss');

    return {
      ...perfil,
      fecha_registro: fechaRegistro, // Cambia el formato de la fecha
      consultas_totales: consultas.consultas_totales,
      consultas_del_dia: consultas.consultas_del_dia,
    };
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    throw error; // Propaga el error para manejarlo en el lugar de llamada
  }
}

module.exports = { obtenerPerfil };
