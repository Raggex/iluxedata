// REGISTRAR USUARIO

// FUNCION REGISTRAR
const {
  registrarUsuario,
  verificarRegistro,
} = require("../../sql/register_user");

module.exports = (bot) => {
  // Manejo de errores de polling
  bot.on("polling_error", (error) => {
    console.error("Error en el bot de Telegram:", error);
  });

  bot.onText("/register", async (msg) => {
    // DATOS USUARIO
    const chatid = msg.chat.id;
    const name = msg.from.first_name;
    const userid = msg.from.id;

    const messageOptions = {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    };

    try {
      const verificacion = await verificarRegistro(userid);
      console.log(verificacion);
      if (verificacion.estatus === false) {
        // SE REGISTRA...
        await registrarUsuario(userid, name);

        const yx = `Felicidades, ha sido registrado`;
        bot.sendMessage(chatid, yx, messageOptions);
      } else {
        const yx = `Usted ya está registrado. Fecha de registro: ${verificacion.date}`;
        bot.sendMessage(chatid, yx, messageOptions);
      }
    } catch (error) {
      console.error("Error al registrar o verificar el usuario:", error);
      bot.sendMessage(
        chatid,
        "Ocurrió un error, por favor intente de nuevo.",
        messageOptions
      );
    }
  });
};
