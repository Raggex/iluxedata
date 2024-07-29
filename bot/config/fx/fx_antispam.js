const antiSpamData = {}; // Objeto para almacenar datos de anti-spam

const { obtenerRango } = require("./obtenerRango");

// Función para activar el anti-spam con un tiempo en segundos
function activarAntiSpam(userid, segundos) {
  const tiempoFin = Date.now() + segundos * 1000;
  antiSpamData[userid] = tiempoFin;
}

// Función para verificar si el usuario está en anti-spam
async function verificarAntiSpam(bot, chatid, userid, messageOptions) {
  // Obtener el rango del usuario
  const rango = await obtenerRango(userid);

  // Si el usuario es DEVELOPER o ADMIN, no aplicamos anti-spam
  if (rango === "DEVELOPER" || rango === "ADMIN") {
    return true;
  }

  // Verificar si el usuario está en anti-spa
  if (antiSpamData[userid] && antiSpamData[userid] > Date.now()) {
    const tiempoRestante = Math.ceil(
      (antiSpamData[userid] - Date.now()) / 1000
    );
    bot.sendMessage(
      chatid,
      `Debes esperar ${tiempoRestante} segundos antes de hacer otra consulta.`,
      messageOptions
    );
    return false;
  }

  // Si el usuario no está en anti-spam, activar el anti-spam y retornar true
  return true;
}

module.exports = { activarAntiSpam, verificarAntiSpam };
