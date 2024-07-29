// API RENIEC
const { api_Reniec } = require("../api/api_persona");

// PATH
const path = require("path");

// NO FOTO
const noFoto = path.join(__dirname, "../resources/img/noFoto.jpg");

// Prototipo...
module.exports = (bot) => {
  // EXPRESION - COMANDO (no sensible a mayúsculas y minúsculas)
  const commandName = /\/dnipp (.+)/i;

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
      let message = `*[ #ILUXEDATA ] → RENIEC NV.1*\n\n`;

      const data = await api_Reniec(dni);
      const listaAni = data.listaAni[0];

      const {
        apeMaterno, // Apellido materno
        apePaterno, // Apellido paterno
        coDocEmi, // Código del documento de emisión
        deRestriccion, // Descripción de restricción
        depaDireccion, // Departamento de la dirección
        departamento, // Departamento
        desDireccion, // Descripción de la dirección
        digitoVerificacion, // Dígito de verificación
        distDireccion, // Distrito de la dirección
        distrito, // Distrito
        donaOrganos, // Donación de órganos
        estadoCivil, // Estado civil
        estatura, // Estatura
        feCaducidad, // Fecha de caducidad del documento
        feEmision, // Fecha de emisión del documento
        feFallecimiento, // Fecha de fallecimiento
        feInscripcion, // Fecha de inscripción
        feNacimiento, // Fecha de nacimiento
        gradoInstruccion, // Grado de instrucción
        inCel, // Indicador de celular
        inGrupoRestri, // Indicador de grupo de restricción
        nomDeclarante, // Nombre del declarante
        nomMadre, // Nombre de la madre
        nomPadre, // Nombre del padre
        nuDni, // Número de DNI
        nuDocDeclarante, // Número de documento del declarante
        nuDocMadre, // Número de documento de la madre
        nuDocPadre, // Número de documento del padre
        nuEdad, // Edad
        nuImagen, // Número de imagen
        preNombres, // Nombres
        provDireccion, // Provincia de la dirección
        provincia, // Provincia
        sexo, // Sexo
        tipoFicha, // Tipo de ficha
        tipoFichaImag, // Tipo de ficha de imagen
        vinculoDeclarante, // Vínculo del declarante
        gruVotacion,
        cancelacion,
      } = listaAni;

      message += `*CUI:* \`${dni}\` - \`${digitoVerificacion}\`\n`;
      message += `*APELLIDOS:* \`${apePaterno}\` - \`${apeMaterno}\`\n`;
      message += `*NOMBRES:* \`${preNombres}\`\n`;
      message += `*GÉNERO:* \`${sexo}\`\n`;
      message += `*EDAD:* \`${nuEdad}\`\n\n`;

      message += `*[📅] NACIMIENTO*\n\n`;

      message += `*FECHA NACIMIENTO:* \`${feNacimiento}\`\n`;
      message += `*DEPARTAMENTO:* \`${departamento}\`\n`;
      message += `*PROVINCIA:* \`${provincia}\`\n`;
      message += `*DISTRITO:* \`${distrito}\`\n\n`;

      message += `*GRADO INSTRUCCIÓN:* \`${gradoInstruccion}\`\n`;
      message += `*ESTADO CIVIL:* \`${estadoCivil}\`\n`;
      message += `*ESTATURA:* \`${estatura}\`\n`;
      message += `*FECHA INSCRIPCIÓN:* \`${feInscripcion}\`\n`;
      message += `*NOMBRE PADRE:* \`${nomPadre}\`\n`;
      message += `*NOMBRE MADRE:* \`${nomMadre}\`\n`;
      message += `*RESTRICCIÓN:* \`${deRestriccion}\`\n\n`;

      message += `*[📍] DIRECCION*\n\n`;

      message += `*DEPARTAMENTO:* \`${depaDireccion}\`\n`;
      message += `*PROVINCIA:* \`${provDireccion}\`\n`;
      message += `*DISTRITO:* \`${distDireccion}\`\n`;
      message += `*DIRECCIÓN:* \`${desDireccion}\`\n\n`;

      message += `*GRUPO VOTACIÓN:* \`${gruVotacion}\`\n`;
      message += `*DONA ÓRGANO:* \`${donaOrganos === "N" ? "NO" : "SI"}\`\n`;

      const mediaGroup = [];

      // FOTO
      const foto = data.foto;
      const firma = data.firma;
      const hderecha = data.hderecha;
      const hizquierda = data.hizquierda;

      if (!foto) {
        // BORRA EL MENSAJE
        await bot.deleteMessage(chatId, consultandoMessage.message_id);

        // ENVIAR MENSAJE
        bot.sendPhoto(chatId, noFoto, {
          caption: message,
          reply_to_message_id: msg.message_id,
          parse_mode: "Markdown",
        });
      } else {
        if (foto) {
          const fotoData = foto.replace(/^data:image\/jpeg;base64,/, "");
          const fotoBuffer = Buffer.from(fotoData, "base64");
          mediaGroup.push({ type: "photo", media: fotoBuffer });
        }
        if (firma) {
          const foto2Data = firma.replace(/^data:image\/jpeg;base64,/, "");
          const fotoBuffer2 = Buffer.from(foto2Data, "base64");
          mediaGroup.push({ type: "photo", media: fotoBuffer2 });
        }
        if (hderecha) {
          const foto3Data = hderecha.replace(/^data:image\/jpeg;base64,/, "");
          const fotoBuffer3 = Buffer.from(foto3Data, "base64");
          mediaGroup.push({ type: "photo", media: fotoBuffer3 });
        }
        if (hizquierda) {
          const foto3Data = hizquierda.replace(/^data:image\/jpeg;base64,/, "");
          const fotoBuffer3 = Buffer.from(foto3Data, "base64");
          mediaGroup.push({
            type: "photo",
            media: fotoBuffer3,
            caption: message,
            parse_mode: "Markdown",
          });
        }

        await bot.deleteMessage(chatId, consultandoMessage.message_id);
        bot.sendMediaGroup(chatId, mediaGroup, messageOptions);
      }

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
