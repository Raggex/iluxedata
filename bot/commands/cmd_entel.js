const { validarOp, titularEntel } = require("../api/api_telefonia");
// VERIFICACIONES
const { veriRegistro } = require("../config/fx/verificarRegistro");
const { veriCreditos } = require("../config/fx/verificarCreditos");
const { verificarPlan } = require("../config/fx/verificarPlan");

const { obtenerCreditos, restarCreditos } = require("../config/fx/credits");

const {
  activarAntiSpam,
  verificarAntiSpam,
} = require("../config/fx/fx_antispam");

const ANTISPAM = 50;
const CREDITS = 10;
const name_Comando = /\/entel (.+)/;

module.exports = (bot) => {
  //POLLING ERROR
  bot.on("polling_error", (error) => {
    console.error("Error en el bot de Telegram:", error);
  });

  bot.onText(name_Comando, async (msg, match) => {
    //Ayudas rápidas como declarar nombres, opciones de mensajes, chatId, etc
    const tel = match[1];
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const typeChat = msg.chat.type;
    const groupName = msg.chat.title;
    const firstName = msg.from.first_name;
    const messageOptions = {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    };

    try {
      const estaRegistrado = await veriRegistro(
        bot,
        chatId,
        userId,
        messageOptions
      );

      if (!estaRegistrado) {
        return; // Detener la ejecución si el usuario no está registrado
      }

      const tienePlan = await verificarPlan(
        bot,
        chatId,
        typeChat,
        messageOptions,
        userId
      );

      if (!tienePlan) {
        return;
      }

      const tieneCreditos = await veriCreditos(
        bot,
        chatId,
        userId,
        messageOptions,
        CREDITS
      );

      if (!tieneCreditos) {
        return;
      }

      const succes_spam = await verificarAntiSpam(
        bot,
        chatId,
        userId,
        messageOptions
      );

      if (!succes_spam) {
        return;
      }

      if (tel.length !== 9) {
        return bot.sendMessage(
          chatId,
          "❰ 👺 ❱ El numero ingresado no tiene 9 numeros.",
          messageOptions
        );
      }

      const consultandoMessage = await bot.sendMessage(
        chatId,
        "❰ ⌛ ❱ Consultando... ",
        messageOptions
      );

      try {
        console.log("Validando operador...");
        const validarOperador = await validarOp(tel);
        console.log("Resultado de validación de operador:", validarOperador);
        if (validarOperador.status === "resolverCapcha") {
          let yxx = `❰ 👺 ❱ Capcha no resuelto intenta más tarde.`;
          await bot.deleteMessage(chatId, consultandoMessage.message_id);

          return bot.sendMessage(chatId, yxx, messageOptions);
        }

        const datosNum = validarOperador.message;

        if (datosNum !== "no encontrado. puede que sea entel") {
          let yxx = `❰ 👺 ❱ La operadora no es ENTEL.`;
          await bot.deleteMessage(chatId, consultandoMessage.message_id);

          return bot.sendMessage(chatId, yxx, messageOptions);
        }

        const res = await titularEntel(tel);
        console.log(res);
        const data = res.daSource;
        const dni = data.nuDni;
        const nomModelo = data.nomModelo;
        const plan = data.nomPlan;
        const feActivacion = data.feActivacion;
        const feRegistro = data.feRegistro;
        const nuImei = data.nuImei;

        let mssg = `*❰* #IluxeD4taADV *❱ → ENTEL*
        
*DOCUMENTO* → ${dni}
*MODELO* → ${nomModelo}
*ACTIVACION* → ${feActivacion}
*REGISTRO* → ${feRegistro}
*IMEI* → ${nuImei}
*PLAN* → ${plan}

*BUSCADO POR* →  ${userId}\n`;

        // Restar créditos y obtener el saldo actualizado
        await restarCreditos(userId, 3);
        const nucreds = await obtenerCreditos(userId);

        // Añadir los créditos restantes al mensaje
        mssg += `*CREDITOS* → ${nucreds}`;

        await bot.deleteMessage(chatId, consultandoMessage.message_id);

        bot.sendMessage(chatId, mssg, messageOptions).then(() => {
          activarAntiSpam(userId, ANTISPAM);
        });
      } catch (error) {
        console.log(error);
        bot.sendMessage(
          chatId,
          "❰ 💀 ❱ Error en la fuente interna.",
          messageOptions
        );
      }
    } catch (error) {
      console.log(error);
      bot.sendMessage(
        chatId,
        "❰ 💀 ❱ Error en la fuente interna.",
        messageOptions
      );
    }
  });
};
