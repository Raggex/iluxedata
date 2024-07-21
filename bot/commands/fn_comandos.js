const path = require("path");

// IMG
const img = path.join(__dirname, "../resources/img/img_Comandos.jpg");

// MESSAGES
const { message } = require("../resources/messages/messages");

// ALMACENAR LOS MENSAJES ID
const comandoInvocado = {};

let messageId;
let photoMessageId;
let originalMessageId = {};

// TECLADO
const keyboard = {
  inline_keyboard: [
    [
      { text: "[💳] RENIEC", callback_data: "boton_Reniec" },
      { text: "[📱] OSIPTEL", callback_data: "boton_Osiptel" },
    ],
    [
      { text: "[⚙️] GENERADOR", callback_data: "boton_Generador" },
      { text: "[➕] EXTRAS", callback_data: "boton_Extras" },
    ],
    [
      { text: "[👮‍♂️] DELITOS", callback_data: "boton_Delitos" },
      { text: "[👨‍👩‍👧‍👦] FAMILIA", callback_data: "boton_Familia" },
    ],
    [
      { text: "[📜] ACTAS   ", callback_data: "boton_Actas" },
      { text: "[💎] VIPS", callback_data: "boton_Vips" },
    ],
  ],
};

module.exports = (bot) => {
  bot.onText(/\/cmds/, (msg) => {
    bot.on("polling_error", (error) => {
      console.log(error);
    });

    //Ayudas rápidas como declarar nombres, opciones de mensajes, chatId, etc
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const typeChat = msg.chat.type;
    const groupName = msg.chat.title;
    const firstName = msg.from.first_name;
    const messageOptions = {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
    };

    // BOTON - CFG
    messageId = msg.message_id; // PRIMER MSG - ID
    console.log("PRIMER ID DE MENSAJE...", messageId);

    comandoInvocado[userId] = messageId + 1;

    // Prototipo...
    bot
      .sendPhoto(chatId, img, {
        caption: message.command_Message(firstName),
        reply_to_message_id: msg.message_id,
        parse_mode: "Markdown",
        reply_markup: JSON.stringify(keyboard),
      })
      .then((sentMessage) => {
        photoMessageId = sentMessage.message_id;
        console.log("ID del mensaje con foto:", photoMessageId);
      })
      .catch((error) => {
        console.error("Error al enviar la foto:", error);
      });
  });

  bot.on("callback_query", (query) => {
    const query_id = query.id;
    const query_userId = query.from.id;
    const query_messageId = query.message.message_id;
    const query_action = query.data;
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const first_name = query.from.firstName;

    console.log("query_id:", query_id);
    console.log("query_messageId:", query_messageId);
    console.log("chatId:", chatId);

    const actions = [
      "boton_Reniec",
      "boton_Osiptel",
      "boton_Generador",
      "boton_Extras",
      "boton_Delitos",
      "boton_Familia",
      "boton_Actas",
      "boton_Vips",
      "boton_Inicio",
    ];

    const boton_inico = {
      inline_keyboard: [
        [{ text: "[🏠] INICIO", callback_data: "boton_Inicio" }],
      ],
    };

    if (actions.includes(query_action)) {
      if (comandoInvocado[userId] !== query_messageId) {
        bot.answerCallbackQuery(query_id, {
          text: "SIN PERMISOS SUFICIENTES",
          show_alert: true,
        });

        console.log("SIN PERMISOS");
      } else {
        console.log("CON PERMISOS en el else...");

        let nuevo_Mensaje;

        switch (query_action) {
          case "boton_Inicio":
            console.log("BOTON INICIO..");
            bot
              .editMessageCaption(`${message.command_Message(first_name)}`, {
                reply_markup: JSON.stringify(keyboard),
                message_id: query_messageId,
                chat_id: chatId,
              })
              .then(() => {
                console.log("to good");
              })
              .catch((error) => {
                console.log(error);
              });
            break; // Añadir break

          case "boton_Reniec":
            nuevo_Mensaje = message.reniec_Boton();
            console.log("BOTON RENIEC..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(boton_inico),
              message_id: query_messageId,
              chat_id: chatId,
            });

            break;

          default:
            break;
        }
      }
    }
  });
};
