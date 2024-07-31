const path = require("path");

const img = path.join(__dirname, "../resources/img/img_start.jpg");

let message = `¡𝓗𝓸𝓵𝓪!  Bienvenido a #IluxeDataACM .Estamos aquí para ofrecerte la mejor experiencia. 🚀💻

[🔰]  Para registrarte, usa /register
[⚒]   Explora los comandos disponibles usando /cmd
[👤]  Descubre más sobre ti mismo con /me

[💰]  Adquiere créditos aquí: [Ing Boss](https://t.me/IluxeBOSS)`;

module.exports = (bot) => {
  const teclado = {
    inline_keyboard: [
      [
        {
          text: "🔥 GRUPO OFICIAL 🔥",
          url: "https://t.me/ILUXE_D4TA" // Cambia esta URL por la URL real de tu grupo
        }
      ]
    ]
  };

  bot.onText(/\/start/, (msg) => {
    bot.sendPhoto(msg.chat.id, img, {
      caption: message,
      reply_markup: JSON.stringify(teclado),
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown"
    });
  });
};
