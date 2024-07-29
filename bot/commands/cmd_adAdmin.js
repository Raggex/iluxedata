const { añadirRangoAdmin } = require("../config/fx/fx_addAdmin");

module.exports = (bot) => {
  bot.onText(/\/addadm (.+)/, async (msg, match) => {
    const userToAdd = match[1];
    const credits = parseInt(match[2], 10); // Asegúrate de que los créditos sean un número entero
    const chatid = msg.chat.id;
    const userid = msg.from.id;
    const messageOptions = {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    };
    try {
      const succes = añadirRangoAdmin(
        userid,
        userToAdd,
        bot,
        chatid,
        messageOptions
      );

      if (!succes) {
        return;
      }

      bot.sendMessage(chatid, "admin añadido.");
    } catch (error) {
      console.log(error);
    }
  });
};
