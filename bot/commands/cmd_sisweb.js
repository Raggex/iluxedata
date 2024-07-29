// VALIDACIONES
const { seekerApi_pdf } = require("../api/api_persona");
// VERIFICACIONES
const { veriRegistro } = require("../config/fx/verificarRegistro");
const { veriCreditos } = require("../config/fx/verificarCreditos");
const { verificarPlan } = require("../config/fx/verificarPlan");

const { obtenerCreditos, restarCreditos } = require("../config/fx/credits");

const ANTISPAM = 100;

const {
  activarAntiSpam,
  verificarAntiSpam,
} = require("../config/fx/fx_antispam");

const CREDITS = 15;
const name_Comando = /\/seeker (.+)/;

const path = require("path");
const fs = require("fs");

module.exports = (bot) => {
  //POLLING ERROR
  bot.on("polling_error", (error) => {
    console.error("Error en el bot de Telegram:", error);
  });

  bot.onText(name_Comando, async (msg, match) => {
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

      let creds_actuales = await obtenerCreditos(userId);

      const succes_spam = await verificarAntiSpam(
        bot,
        chatId,
        userId,
        messageOptions
      );

      if (!succes_spam) {
        return;
      }

      const consultandoMessage = await bot.sendMessage(
        chatId,
        "consultando..."
      );

      try {
        if (dni.length !== 8) {
          await bot.deleteMessage(chatId, consultandoMessage.message_id);

          return bot.sendMessage(
            chatId,
            "EL DNI DEBE TENER 8 NUMEROS",
            messageOptions
          );
        }

        const res_pdf = await seekerApi_pdf(dni);

        const pdf = res_pdf.base64PDF;
        // Convertir base64 a buffer
        const pdfBuffer = Buffer.from(pdf, "base64");

        const save = path.join(__dirname, "../../fichasDocuments");

        if (!fs.existsSync(save)) {
          // Si el directorio no existe, créalo
          fs.mkdirSync(save, { recursive: true });
          console.log(`Directorio creado: ${save}`);
        } else {
          console.log(`El directorio ya existe: ${save}`);
        }
        // Crear un archivo temporal para guardar el PDF
        const tempFilePath = path.join(save, `${dni}_data.pdf`);

        fs.writeFile(tempFilePath, pdfBuffer, async (err) => {
          if (err) {
            console.error("Error al guardar el archivo temporal:", err);
            return;
          }

          // Enviar el archivo PDF a través de Telegram
          await bot.deleteMessage(chatId, consultandoMessage.message_id);

          let mssg = `➢ Consulta hecha con exito `;

          bot
            .sendDocument(chatId, tempFilePath, {
              caption: mssg,
              reply_to_message_id: msg.message_id,
            })
            .then(async () => {
              restarCreditos(userId, CREDITS);
              activarAntiSpam(userId, ANTISPAM);
            })
            .catch((err) => {
              console.error("Error al enviar el PDF:", err);
            });
        });
        // }
      } catch (error) {
        console.log(error);
      }

    } catch (error) {
      console.log(error);
    }
  });
};
