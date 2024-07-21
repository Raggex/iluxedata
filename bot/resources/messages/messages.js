// MENSAJE START

const message = {
  command_Message: (firstName) => {
    let message = `*❰ #IluxeD4taACM ❱ → IluxeComunity*\n\n`;

    message += `*🔱 ILUXE D4TA 🔱*\n\n`;

    message += `Hola, Bienvenido ${firstName} a nuestro Menú Principal de Comandos\n\n`;

    message += `📌Nuestro comandos se encuentran divididos en secciones para facilitar la interacción del usuario.\n\n`;

    message += `Selecciona una sección en la parte inferior para visualizar los comandos.`;
    return message;
  },

  reniec_Boton: () => {
    let message = `🔍 COMANDOS PARA RENIEC

📍 DNI INFO + FOTO 
  - Formato: /dni 27427864
  - Estado: ACTIVO ✅
━━━━━━━━━━━━━━━━━━
📍 ROSTRO, FIRMA Y HUELLAS 
  - Formato: /dnit 27427864
  - Estado: ACTIVO ✅
━━━━━━━━━━━━━━━━━━
📍 BUSQUEDA POR NOMBRES 
  - Formato: /nm N1 N2|AP1|AP2
  - Formato: /nm N1|AP1|AP2
  - Estado: ACTIVO ✅
`;

return message
  },

  start_Button: () => {
    let message = `𝐂𝐨𝐧𝐭𝐚𝐜𝐭𝐨 - 𝐒𝐨𝐩𝐨𝐫𝐭𝐞 - 𝐂𝐨𝐦𝐩𝐫𝐚𝐫.💡`;
    return message;
  },
};

module.exports = { message };
