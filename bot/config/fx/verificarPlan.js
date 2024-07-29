const { verificarCreditos } = require("./credits"); // Ajusta la ruta según sea necesario
const { obtenerRango } = require("./obtenerRango"); // Ajusta la ruta según sea necesario

async function verificarPlan(bot, chatid, typeChat, messageOptions, userid) {

  try {
    const tieneCreditos = await verificarCreditos(userid, 1); // Verifica si el usuario tiene al menos 1 crédito
    const rango = await obtenerRango(userid)
    console.log(rango);
    if (!tieneCreditos && typeChat === "private" && rango === "FREE") {
      // Si el usuario no tiene créditos, enviar un mensaje informativo
      const mensaje = "No tienes ningún plan asociado a tu cuenta para el uso privado. Por favor, adquiere créditos para acceder a estos servicios.";
      await bot.sendMessage(chatid, mensaje, messageOptions);
      return false
    }

    if(!tieneCreditos && rango === "FREE"){
      bot.sendMessage(chatid, "sin creditos")
      return false
    }

    return true

  } catch (error) {
    console.error("Error al verificar el chat o créditos:", error);
    await bot.sendMessage(chatid, "Hubo un error al procesar tu solicitud. Intenta nuevamente más tarde.", messageOptions);
  }
}

module.exports = { verificarPlan };
