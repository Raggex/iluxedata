// utils.js
const fs = require("fs");
const path = require("path");

// DIR PATH
const dir_rango = path.join(__dirname, "../rangos/rangos.json");

// GRUPOS PERMITIDOS
const gruposPermitidos = require("../gruposManager/gruposPermitidos");

// Función para verificar rangos
const verificarRangos = (userId) => {
  try {
    const data = fs.readFileSync(dir_rango, "utf8");
    const rangosFilePath = JSON.parse(data);
    const isDev = rangosFilePath.DEVELOPER.includes(userId);
    const isOwner = rangosFilePath.OWNER.includes(userId);
    return { isDev, isOwner };
  } catch (err) {
    console.error("Error al leer o parsear el archivo de rangos:", err);
    return { isDev: false, isOwner: false };
  }
};

// Función para verificar si el grupo está permitido
const verificarGrupoPermitido = (bot, chatId, groupName, isOwner, isDev) => {
  if (!gruposPermitidos.includes(chatId) && !isOwner && !isDev) {
    bot.sendMessage(chatId, `*Grupo no autorizado*`, {
      parse_mode: "Markdown",
    });
    // .then(() => {
    //   console.log(
    //     `Se ha añadido e intentado usar el bot en el grupo con ID ${chatId} y NOMBRE ${groupName}`
    //   );
    //   let noGrupo = `*[ 🔌 ] Se me han querido usar* en este grupo:\n\n`;
    //   noGrupo += `*-👥:* \`${groupName}\`\n`;
    //   noGrupo += `*-🆔:* \`${chatId}\`\n`;

    //   // Obtener el enlace de invitación del grupo
    //   bot
    //     .exportChatInviteLink(chatId)
    //     .then((inviteLink) => {
    //       if (inviteLink) {
    //         noGrupo += `*-🔗:* ${inviteLink}\n`;
    //       }

    //       return bot.sendMessage(6484858971, noGrupo, {
    //         parse_mode: "Markdown",
    //         disable_web_page_preview: true,
    //       });
    //     })
    //     .catch((error) => {
    //       console.log(
    //         "Error al obtener el enlace de invitación del grupo: ",
    //         error.message
    //       );
    //     });
    // })
    // .catch((error) => {
    //   console.log(
    //     "Error al enviar el mensaje de grupo no autorizado: ",
    //     error.message
    //   );
    // });
    return false;
  }
  return true;
};

const verificarUsoPrivado = (bot, chatId, typeChat, isDev, isOwner) => {
  if (typeChat === "private" && !isDev && !isOwner) {
    let mensaje = `*Uso privado bloqueado*`;
    bot.sendMessage(chatId, mensaje, { parse_mode: "Markdown" }); // messageOptions

    return false;
  }
  return true;
};

module.exports = {
  verificarRangos,
  verificarGrupoPermitido,
  verificarUsoPrivado,
};
