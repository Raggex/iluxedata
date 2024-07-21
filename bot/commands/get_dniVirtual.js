// API RENIEC
const { getDNIVirtual } = require("../api/api_persona");

// PATH
const path = require("path");

// NO FOTO
const noFoto = path.join(__dirname, "../resources/img/noFoto.jpg");

// RANGOS Y GRUPOS
const {
  verificarRangos,
  verificarGrupoPermitido,
  verificarUsoPrivado,
} = require("../config/fx/verificarGrupo");

// Prototipo...
module.exports = (bot) => {
  // EXPRESION - COMANDO (no sensible a mayúsculas y minúsculas)
  const commandName = /\/dnip (.+)/i;

  bot.onText(commandName, async (msg, match) => {
    //POLLING ERROR
    bot.on("polling_error", (error) => {
      console.error("Error en el bot de Telegram:", error);
    });

    //Ayudas rápidas como declarar nombres, opciones de mensajes, chatId, etc
    const dni = match[1];
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const typeChat = msg.chat.type;
    const groupName = msg.chat.title;
    const firstName = msg.from.first_name;
    const messageOptions = {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    };

    const { isDev, isOwner } = verificarRangos(userId);

    // if (!isDev && !isOwner) {
    //   bot.sendMessage(chatId, "No tienes permiso para usar este comando.");
    //   return;
    // }

    // // Verificar uso privado
    // if (
    //   !verificarUsoPrivado(
    //     bot,
    //     chatId,
    //     typeChat,
    //     isDev,
    //     isOwner
    //   )
    // ) {
    //   return;
    // }

    // Lógica del comando, incluyendo la verificación del grupo permitido
    if (!verificarGrupoPermitido(bot, chatId, groupName, isOwner, isDev)) {
      return;
    }

    // SI EL DNI TIENE MENOS DE 8 NÚMEROS...
    // Validar que el DNI tiene exactamente 8 dígitos y solo contiene números
    const dniRegex = /^\d{8}$/;

    if (!dniRegex.test(dni)) {
      return bot.sendMessage(
        chatId,
        "*DNI inválido. Debe contener exactamente 8 números.*",
        messageOptions
      );
    }

    let yx = `*Consultando datos...*`;

    const consultandoMessage = await bot.sendMessage(
      chatId,
      yx,
      messageOptions
    );

    // TEST - TIME
    const startTime = new Date(); // Capturar el tiempo de inicio

    try {
      // CONSTRUCCIÓ MENSAJE - BOT

      let message = `*Dni virtual exitoso*`;

      const responseDniVirtual = await getDNIVirtual(dni);

      const caraDni = responseDniVirtual.frontal_base64;
      const atrasDni = responseDniVirtual.posterior_base64;

      const mediaGroup = [];

      if (caraDni) {
        const caraDniFoto = caraDni.replace(/^data:image\/jpeg;base64,/, "");
        const fotoBuffer = Buffer.from(caraDniFoto, "base64");
        mediaGroup.push({ type: "photo", media: fotoBuffer });
      }

      if (atrasDni) {
        const atrasDniFoto = atrasDni.replace(/^data:image\/jpeg;base64,/, "");
        const fotoBuffer2 = Buffer.from(atrasDniFoto, "base64");
        mediaGroup.push({
          type: "photo",
          media: fotoBuffer2,
          caption: message,
          parse_mode: "Markdown",
        });
      }

      bot.sendMediaGroup(chatId, mediaGroup, {
        reply_to_message_id: msg.message_id,
      });

      // END - TIME TEST
      const endTime = new Date(); // Capturar el tiempo de finalización
      const timeDiff = endTime - startTime; // Calcular la diferencia de tiempo en milisegundos
      const timeInSeconds = (timeDiff / 1000).toFixed(2); // Convertir a segundos y formatear a 2 decimales

      let xx = `Tiempo de la consulta... *${timeInSeconds} segundos*.`;
      bot.sendMessage(chatId, xx, messageOptions);

      // LLAMADO API RENIEC
    } catch (error) {
      await bot.deleteMessage(chatId, consultandoMessage.message_id);
      bot.sendMessage(chatId, `*Error en la consulta...*`, messageOptions);
    }
  });
};
