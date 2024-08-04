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
    // console.log("PRIMER ID DE MENSAJE...", messageId);

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
        // console.log("ID del mensaje con foto:", photoMessageId);
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

    // console.log("query_id:", query_id);
    // console.log("query_messageId:", query_messageId);
    // console.log("chatId:", chatId);

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
      "boton_Atras_osp",
      "boton_Inicio",
      "boton_Siguiente_osp",
      "boton_Atras_gen",
      "boton_Atras_gen_2",
      "boton_Siguiente_gen",
      "boton_Siguiente_gen_2",
      "boton_Atras_extra",
      "boton_Siguiente_extra",
      "boton_Atras_del",
      "boton_Siguiente_del",
    ];

    const boton_inico = {
      inline_keyboard: [
        [{ text: "[🏠] INICIO", callback_data: "boton_Inicio" }],
      ],
    };

    const keyboard_next_osp = {
      inline_keyboard: [
        [
          { text: "←", callback_data: "boton_Atras_osp" },
          { text: "[🏠] INICIO", callback_data: "boton_Inicio" },
          { text: "→", callback_data: "boton_Siguiente_osp" },
        ],
      ],
    };

    const keyboard_next_gen = {
      inline_keyboard: [
        [
          { text: "←", callback_data: "boton_Atras_gen" },
          { text: "[🏠] INICIO", callback_data: "boton_Inicio" },
          { text: "→", callback_data: "boton_Siguiente_gen" },
        ],
      ],
    };

    const keyboard_next_gen_2 = {
      inline_keyboard: [
        [
          { text: "←", callback_data: "boton_Atras_gen_2" },
          { text: "[🏠] INICIO", callback_data: "boton_Inicio" },
          { text: "→", callback_data: "boton_Siguiente_gen_2" },
        ],
      ],
    };

    const keyboard_next_extra = {
      inline_keyboard: [
        [
          { text: "←", callback_data: "boton_Atras_extra" },
          { text: "[🏠] INICIO", callback_data: "boton_Inicio" },
          { text: "→", callback_data: "boton_Siguiente_extra" },
        ],
      ],
    };

    const keyboard_next_del = {
      inline_keyboard: [
        [
          { text: "←", callback_data: "boton_Atras_del" },
          { text: "[🏠] INICIO", callback_data: "boton_Inicio" },
          { text: "→", callback_data: "boton_Siguiente_del" },
        ],
      ],
    };

    if (actions.includes(query_action)) {
      if (comandoInvocado[userId] !== query_messageId) {
        bot.answerCallbackQuery(query_id, {
          text: "SIN PERMISOS SUFICIENTES",
          show_alert: true,
        });

        // console.log("SIN PERMISOS");
      } else {
        // console.log("CON PERMISOS en el else...");

        let nuevo_Mensaje;

        switch (query_action) {
          case "boton_Inicio":
            // console.log("BOTON INICIO..");
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
            // console.log("BOTON RENIEC..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(boton_inico),
              message_id: query_messageId,
              chat_id: chatId,
            });

            break;

          case "boton_Osiptel":
            nuevo_Mensaje = message.osiptel_Button().message;
            // console.log("BOTON OSIPTEL..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_osp),
              message_id: query_messageId,
              chat_id: chatId,
            });

            break;

          case "boton_Siguiente_osp":
            nuevo_Mensaje = message.osiptel_Button().message_2;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_osp),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Atras_osp":
            nuevo_Mensaje = message.osiptel_Button().message;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_osp),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Generador":
            nuevo_Mensaje = message.generador_Button().message;
            // console.log("BOTON GENERADOR");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_gen),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Siguiente_gen":
            try {
              nuevo_Mensaje = message.generador_Button().message_2;
              // console.log("BOTON GENERADOR SIGUIENTE");
              bot.editMessageCaption(nuevo_Mensaje, {
                reply_markup: JSON.stringify(keyboard_next_gen_2),
                message_id: query_messageId,
                chat_id: chatId,
              });
              break;
            } catch (error) {
              console.log(error);
            }

          case "boton_Siguiente_gen_2":
            nuevo_Mensaje = message.generador_Button().message_3;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_gen_2),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Atras_gen_2":
            nuevo_Mensaje = message.generador_Button().message_2;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_gen),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Atras_gen":
            nuevo_Mensaje = message.generador_Button().message;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_gen),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Extras":
            nuevo_Mensaje = message.extras_Button().message;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_extra),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Delitos":
            nuevo_Mensaje = message.delitos_Button().message;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_extra),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Familia":
            nuevo_Mensaje = message.familia_Button().message;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_extra),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Actas":
            nuevo_Mensaje = message.actas_Button().message;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_extra),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          case "boton_Vips":
            nuevo_Mensaje = message.vip_Button().message;
            // console.log("BOTON OSIPTEL 2..");
            bot.editMessageCaption(nuevo_Mensaje, {
              reply_markup: JSON.stringify(keyboard_next_extra),
              message_id: query_messageId,
              chat_id: chatId,
            });
            break;

          default:
            bot.answerCallbackQuery(query_id, {
              text: "Ya estás en la primera página",
              // show_alert: true,
            });
            break;
        }
      }
    }
  });
};
