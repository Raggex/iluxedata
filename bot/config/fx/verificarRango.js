const fs = require('fs');
const path = require('path');

// DIR PATH
const dir_rango = path.join(__dirname, "../rangos/rangos.json");

// Función para verificar rangos
const verificarRangos = (userId) => {
  try {
    const data = fs.readFileSync(dir_rango, 'utf8');
    const rangosFilePath = JSON.parse(data);
    const isDev = rangosFilePath.DEVELOPER.includes(userId);
    const isOwner = rangosFilePath.OWNER.includes(userId);
    return { isDev, isOwner };
  } catch (err) {
    console.error('Error al leer o parsear el archivo de rangos:', err);
    return { isDev: false, isOwner: false };
  }
};

module.exports = verificarRangos;
