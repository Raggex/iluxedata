const { verificarRegistro } = require("../../../sql/register_user");

async function veriRegistro(bot, chatid, userid, messageOptions) {
  try {
    const verificacion = await verificarRegistro(userid);

    if (verificacion.estatus === false) {
      const mensaje =
        "Usted no ha sido registrado, por favor utilice /register para registrarse.";
      await bot.sendMessage(chatid, mensaje, messageOptions);
      return false; // Indicar que el usuario no está registrado
    }

    return true; // Indicar que el usuario está registrado
  } catch (error) {
    console.error("Error en la verificación del registro:", error);
    await bot.sendMessage(
      chatid,
      "Hubo un error al procesar la solicitud. Intente nuevamente más tarde.",
      messageOptions
    );
    return false; // Considerar como no registrado en caso de error
  }
}

module.exports = { veriRegistro };
