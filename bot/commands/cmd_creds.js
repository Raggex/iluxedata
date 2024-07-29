const {
  verificarCreditos,
  agregarCreditos,
  restarCreditos,
} = require("../config/fx/credits");

// FUNCION REGISTRAR
const {
  registrarUsuario,
  verificarRegistro,
} = require("../../sql/register_user");

const { veriRegistro } = require("../config/fx/verificarRegistro");

const { obtenerRango } = require("../config/fx/obtenerRango");

module.exports = (bot) => {
  bot.onText(/\/addcred (.+) (.+)/, async (msg, match) => {
    const userToAdd = match[1];
    const credits = parseInt(match[2], 10); // Asegúrate de que los créditos sean un número entero
    const chatid = msg.chat.id;
    const userid = msg.from.id;
    const messageOptions = {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    };

    try {
      const isRegister = await veriRegistro(bot, chatid, userid, messageOptions);

      if (!isRegister) {
        return;
      }

      const rango = await obtenerRango(userid);

      if (rango === "DEVELOPER" || rango === "ADMIN") {
        const veri_RegUser = await verificarRegistro(userToAdd);

        if (veri_RegUser.estatus === false) {
          return bot.sendMessage(
            chatid,
            `*El usuario ${userToAdd}* no está registrado en el Bot. Porfavor solicitar que se registre.`,
            messageOptions
          );
        }

        const success = await agregarCreditos(userToAdd, credits);
        if (success) {
          bot.sendMessage(
            chatid,
            `Créditos añadidos correctamente a ${userToAdd}.`
          );
        } else {
          bot.sendMessage(chatid, `No se pudo añadir créditos a ${userToAdd}.`);
        }
      } else {
        return bot.sendMessage(chatid, "no rango");
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(
        chatid,
        `Ocurrió un error al añadir créditos: ${error.message}`
      );
    }
  });

  // bot.onText(/\/test/, async (msg, match) => {
  //   const userid = msg.from.id;
  //   const credits = parseInt(match[2], 10); // Asegúrate de que los créditos sean un número entero
  //   const chatid = msg.chat.id;

  //   try {
  //     const success = await verificarCreditos(userid, 50);
  //     if (!success) {
  //       bot.sendMessage(chatid, "creditos insuficientes");
  //     } else {
  //       bot.sendMessage(chatid, "todo bien xd");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatid, `Ocurrió un error al añadir créditos`);
  //   }
  // });
};
