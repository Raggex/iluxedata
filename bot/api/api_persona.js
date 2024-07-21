// AXIOS
const axios = require("axios");

// API RENIEC - DANNITA -
async function api_Reniec(dni) {
  // URL
  const apiUrl = `http://161.132.41.250:3500/reniec?dni=${dni}`;

  // EXTRACCIÓN
  try {
    const res = await axios.get(apiUrl);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//API DNI VIRTUAL
async function getDNIVirtual(dni) {
  //END - POINT DNIVirtual - API
  const apiUrl = `http://161.132.48.228:4000/procesar_dni?dni=${dni}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.status !== 200) {
      throw new Error(`Error al obtener el DNI Virtual: ${response.status}`);
    }
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error al obtener el DNI Virtual desde la API", error);
    throw error;
  }
}

module.exports = { api_Reniec, getDNIVirtual };
