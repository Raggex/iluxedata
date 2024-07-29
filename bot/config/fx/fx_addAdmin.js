const { obtenerRango } = require("./obtenerRango");
const { promisePool } = require("../../../sql/connection"); // Asegúrate de importar el pool de conexiones

// Función para añadir un usuario al rango ADMIN
async function añadirRangoAdmin(
  userid,
  usertoadmin,
  bot,
  chatid,
  messageOptions
) {
  try {
    // Verifica que el usuario que realiza la acción sea DEVELOPER
    const rangoAccionUsuario = await obtenerRango(userid);

    if (rangoAccionUsuario !== "DEVELOPER") {
      bot.sendMessage(chatid, "que haces...", messageOptions);
      return false;
    }

    // Actualiza el rango del usuario objetivo a ADMIN
    const [result] = await promisePool.query(
      "UPDATE usuarios SET rango = 'ADMIN' WHERE userid = ?",
      [usertoadmin]
    );

    // Verifica el resultado
    if (result.affectedRows > 0) {
      console.log("Rango actualizado a ADMIN correctamente");
      return true;
    } else {
      console.log("No se pudo actualizar el rango");
      return false;
    }
  } catch (error) {
    console.error("Error al añadir rango ADMIN:", error);
    throw error;
  }
}

module.exports = { añadirRangoAdmin };
