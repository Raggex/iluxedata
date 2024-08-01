// VALIDACIONES
const { validarOp, titularMov } = require("../api/api_telefonia");
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
const CREDITS = 5;
const name_Comando = /\/movistar (.+)/;

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
        const validarOperador = await validarOp(tel);

        if (validarOperador.status === "resolverCapcha") {
          let yxx = `❰ 👺 ❱ Capcha no resuelto intenta más tarde.`;
          await bot.deleteMessage(chatId, consultandoMessage.message_id);

          return bot.sendMessage(chatId, yxx, messageOptions);
        }

        const datosNum = validarOperador.operador;
        console.log(validarOperador);

        if (datosNum !== "Movistar") {
          let yxx = `❰ 👺 ❱ La operadora no es MOVISTAR.`;
          await bot.deleteMessage(chatId, consultandoMessage.message_id);

          return bot.sendMessage(chatId, yxx, messageOptions);
        }

        const responseMov = await titularMov(tel);

        const dataMovistar = responseMov[0];

        //DATOS MOVISTAR
        const tipoProducto = dataMovistar.tipoProducto;
        const modo = dataMovistar.modo;
        const plan = dataMovistar.plan;
        const imei = dataMovistar.numImei;
        const titular = dataMovistar.nomTitular;
        const tecnologia = dataMovistar.desTecnologia;
        const tipProducto = dataMovistar.tipProducto;
        const feCompra = dataMovistar.celInfo.feCompra;

        let mssg = `*❰* #IluxeD4taADV *❱ → MOVISTAR*
        
*TITULAR* → ${titular}
*TECNOLOGIA* → ${tecnologia}
*COMPRA* → ${feCompra}
*TIPO* → ${tipProducto}
*PLAN* → ${plan}
*MODO* → ${modo}
*IMEI* → ${imei}

*BUSCADO POR* →  ${userId}
        `;

        await bot.deleteMessage(chatId, consultandoMessage.message_id);

        bot.sendMessage(chatId, mssg, messageOptions).then(async () => {
          restarCreditos(userId, CREDITS);
          activarAntiSpam(userId, ANTISPAM);
        });
      } catch (error) {
        console.log(error);
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
