const { promisePool } = require("../../../sql/connection"); // Asegúrate de importar el pool de conexiones

async function obtenerRango(userid) {
  if (typeof userid === "undefined") {
    throw new Error("El userid no está definido");
  }

  try {
    // Ejecuta la consulta usando el pool de conexiones
    const [rows] = await promisePool
      .query("SELECT rango FROM usuarios WHERE userid = ?", [userid]);

    // Verifica si se encontraron resultados
    if (rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    // Retorna el valor del campo 'rango'
    return rows[0].rango;
  } catch (error) {
    console.error("Error al obtener el rango:", error);
    throw error; // Propaga el error para manejarlo en el lugar de llamada
  }
}

async function obtRango(bot, chatid, userid, messageOptions) {
  try {
    const rango = await obtenerRango(userid);

    if (rango === "FREE") {
      bot.sendMessage(
        chatid,
        "El comando es exclusivo para uso de compradores.",
        messageOptions
      );
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { obtRango, obtenerRango };
