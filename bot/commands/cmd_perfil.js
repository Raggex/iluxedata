const { obtenerPerfil } = require("../config/fx/get_perfil");
const { veriRegistro } = require("../config/fx/verificarRegistro");

module.exports = (bot) => {
  bot.onText(/\/me/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const typeChat = msg.chat.type;
    const groupName = msg.chat.title;
    const firstName = msg.from.first_name;
    const messageOptions = {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    };
    const isRegister = veriRegistro(bot, chatId, userId, messageOptions);

    if (!isRegister) {
      return;
    }

    try {
      const perfil = await obtenerPerfil(userId);

      let msg = `*PERFIL ${firstName}*\n\n`;
      msg += `➢ RANGO: *${perfil.rango}*\n`;
      msg += `➢ CREDITOS: *${perfil.creditos}*`;

      bot.sendMessage(chatId, msg, messageOptions);
    } catch (error) {
      console.log(error);
    }
  });
};
