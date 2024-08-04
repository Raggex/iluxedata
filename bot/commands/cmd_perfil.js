const { obtenerPerfil } = require("../config/fx/get_perfil");
const { veriRegistro } = require("../config/fx/verificarRegistro");

const path = require("path");
const img_adm = path.join(__dirname, "../resources/img/perfil_admin.jpg");
const img = path.join(__dirname, "../resources/img/perfil.jpg");

module.exports = (bot) => {
  bot.onText(/\/me/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const typeChat = msg.chat.type;
    const groupName = msg.chat.title;
    const firstName = msg.from.first_name;
    const username = msg.from.username;
    const messageOptions = {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    };

    try {
      const isRegister = await veriRegistro(
        bot,
        chatId,
        userId,
        messageOptions
      );

      if (!isRegister) {
        return;
      }

      const perfil = await obtenerPerfil(userId);
      console.log(perfil);

      const rango = perfil.rango;
      console.log(rango);

      let mssg = `*#Iluxe_Data_ACM 💫*\n\n`;

      if (rango === "ADMIN" || rango === "DEVELOPER") {
        mssg += `*[🙎‍♂️] ID →* ${userId}\n`;
        mssg += `*[🗒] NOMBRE →* ${firstName}\n`;
        mssg += `*[⚡️] USUARIO →* ${username}\n`;
        mssg += `*[💰] CREDITOS →* ${perfil.creditos}\n`;
        mssg += `*[📅] ROL →* ${perfil.rol}\n`;
        mssg += `*[📈] PLAN →* ${perfil.PLAN}\n`;
        mssg += `*[🗓] REGISTRO →* ${perfil.fecha_registro}\n`;
        mssg += `*[🔎] CONSULTAS →* ${perfil.consultas_totales}\n`;
        mssg += `*[📆] HOY →* ${perfil.consultas_del_dia}\n`;

        bot.sendPhoto(chatId, img_adm, {
          caption: mssg,
          reply_to_message_id: msg.message_id,
          parse_mode: "Markdown",
        });
      } else {
        mssg += `*[🙎‍♂️] ID →* ${userId}\n`;
        mssg += `*[🗒] NOMBRE →* ${firstName}\n`;
        mssg += `*[⚡️] USUARIO →* ${username}\n`;
        mssg += `*[💰] CREDITOS →* ${perfil.creditos}\n`;
        mssg += `*[📅] ROL →* ${perfil.rol}\n`;
        mssg += `*[📈] PLAN →* ${perfil.PLAN}\n`;
        mssg += `*[🗓] REGISTRO →* ${perfil.fecha_registro}\n`;
        mssg += `*[🔎] CONSULTAS →* ${perfil.consultas_totales}\n`;
        mssg += `*[📆] HOY →* ${perfil.consultas_del_dia}\n`;

        bot.sendPhoto(chatId, img, {
          caption: mssg,
          reply_to_message_id: msg.message_id,
          parse_mode: "Markdown",
        });
      }
    } catch (error) {
      console.error("Error al procesar el comando /me:", error);
      bot.sendMessage(
        chatId,
        "❰ 💀 ❱ Error al obtener el perfil del usuario.",
        messageOptions
      );
    }
  });
};
