const { verificarCreditos } = require("./credits");
const { obtenerRango } = require("./obtenerRango");

async function veriCreditos(bot, chatid, userid, messageOptions, creditos) {
  try {
    // Obtener el rango del usuario
    const rango = await obtenerRango(userid);
    const isDev = rango === "DEVELOPER";
    const isAdm = rango === "ADMIN";

    // Verificar si el usuario tiene créditos suficientes
    const tieneCreditos = await verificarCreditos(userid, creditos);

    if (!tieneCreditos && !isDev && !isAdm) {
      // El usuario no tiene suficientes créditos y no es ni DEV ni ADM
      bot.sendMessage(
        chatid,
        "No tienes créditos suficientes para este comando.",
        messageOptions
      );
      return false;
    }

    // El usuario tiene créditos suficientes o es DEV/ADM
    return true;
  } catch (error) {
    console.log(error);
    bot.sendMessage(
      chatid,
      `Ocurrió un error al verificar los créditos: ${error.message}`,
      messageOptions
    );
    return false;
  }
}

module.exports = { veriCreditos };
