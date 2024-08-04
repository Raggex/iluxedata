let mssg = `🇵🇪 CREDITOS - PRECIOS  🇵🇪  
ILUXE D4TA ADV BOT

❰ STANDARD - 20's ❱ 
💫70 CRÉDITOS + 5 → 10 SOLES
💫145 CRÉDITOS + 5 → 20 SOLES
 
❰ VIP - 10's ❱ 
💫350 CRÉDITOS + 50 → 40 SOLES
💫700 CRÉDITOS + 50 → 60 SOLES


 ❰ HAXER - 5's ❱   
💫1.3K CRÉDITOS + 50 → 80 SOLES
💫1.3k CRÉDITOS + 500 → 100 SOLES

ϟϟϟϟϟϟϟϟϟϟϟϟϟϟϟϟϟϟϟϟϟ  
 
 ❰ CREDITOS ILIMITADOS - 5's ❱ 

💫ILIMITADO 07 DIAS → 25 SOLES
💫ILIMITADO 15 DIAS → 40 SOLES
💫ILIMITADO 30 DIAS → 65 SOLES 

↓ Compra aquí con ↓`;

module.exports = (bot) => {
  bot.onText(/\/buy/, async (msg) => {
    const keyboard = {
      inline_keyboard: [
        [{ text: "[🩸] ING BOSS - [FUNDADOR]", url: "https://t.me/IluxeBOSS" }],
        [
          {
            text: "[🩸] LEFT DEATH - [CO - FUNDER]",
            url: "https://t.me/DE4TH69",
          },
        ],
      ],
    };

    try {
      bot.sendMessage(msg.chat.id, mssg, {
        reply_to_message_id: msg.message_id,
        parse_mode: "Markdown",
        reply_markup: JSON.stringify(keyboard),
      });
    } catch (error) {
      console.log(error);
    }
  });
};
