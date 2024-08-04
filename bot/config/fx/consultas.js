const moment = require("moment-timezone");
const { promisePool } = require("../../../sql/connection");

// Función para actualizar las estadísticas de consultas del usuario
async function actualizarConsultas(usuarioId, incremento) {
  try {
    // Obtén el registro actual del usuario en la tabla consultas
    const [rows] = await promisePool.query(
      "SELECT consultas_totales, consultas_del_dia, fecha_ultimo_reset FROM consultas WHERE userid = ?",
      [usuarioId]
    );

    const now = moment().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss");
    let nuevoContadorDia = incremento;

    if (rows.length === 0) {
      // Si no se encontró el usuario, crea un nuevo registro
      await promisePool.query(
        "INSERT INTO consultas (userid, consultas_totales, consultas_del_dia, fecha_ultimo_reset) VALUES (?, ?, ?, ?)",
        [usuarioId, incremento, incremento, now]
      );
    } else {
      const { consultas_totales, consultas_del_dia, fecha_ultimo_reset } =
        rows[0];

      // Verifica si ha pasado un día desde el último restablecimiento
      const fechaUltimoReset = moment(fecha_ultimo_reset).tz("America/Lima");
      const diferenciaHoras = moment().diff(fechaUltimoReset, "hours");

      if (diferenciaHoras >= 24) {
        nuevoContadorDia = incremento; // Restablece el contador de consultas del día
      } else {
        nuevoContadorDia = consultas_del_dia + incremento; // Incrementa el contador de consultas del día
      }

      await promisePool.query(
        "UPDATE consultas SET consultas_totales = ?, consultas_del_dia = ?, fecha_ultimo_reset = ? WHERE userid = ?",
        [consultas_totales + incremento, nuevoContadorDia, now, usuarioId]
      );
    }
  } catch (error) {
    console.error("Error al actualizar las consultas del usuario:", error);
    throw error; // Propaga el error para manejarlo en el lugar de llamada
  }
}

module.exports = { actualizarConsultas };
