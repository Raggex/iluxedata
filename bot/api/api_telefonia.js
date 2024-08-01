// CONST APIS TELEFONAS

const axios = require("axios");

async function validarOp(tel) {
  const url = "https://dashboard.knowlers.xyz/personas/validateoperador";
  const payload = {
    phone: tel,
  };

  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error after logging it
  }
}

//API CLARO
async function titularClaro(tel) {
  //END - PINT
  const apiUrl = `http://161.132.48.228:8080/clanum?num=${tel}`;

  try {
    const responseClaro = await axios.get(apiUrl);

    if (responseClaro.status !== 200) {
      throw new Error(
        "Error al obtener la información de la api CLARO: ",
        responseClaro.status
      );
    }

    const data = responseClaro.data;
    return data;
  } catch (error) {
    console.log("Error en la api Claro: ", error);
  }
}

async function titularBitel(tel) {
  const apiUrl = `  http://161.132.48.228:8040/bitlive?num=${tel}`;

  try {
    const responseClaro = await axios.get(apiUrl);

    if (responseClaro.status !== 200) {
      throw new Error(
        "Error al obtener la información de la api CLARO: ",
        responseClaro.status
      );
    }

    const data = responseClaro.data;
    return data;
  } catch (error) {
    console.log("Error en la api Claro: ", error);
  }
}

async function titularEntel(tel) {
  const apiUrl = `http://161.132.48.30:4010/mx1Nb1YcNP4DzWYMiYn72oPoT4i6N/numero/${tel}`;

  try {
    const responseClaro = await axios.get(apiUrl);

    // if (responseClaro.status !== 200) {
    //   throw new Error(
    //     "Error al obtener la información de la api CLARO: ",
    //     responseClaro.status
    //   );
    // }

    const data = responseClaro.data;
    return data;
  } catch (error) {
    console.log("Error en la api Claro: ", error);
  }
}

async function titularMov(tel) {
  const apiUrl = `http://161.132.55.243:4010/numero/${tel}`;

  try {
    const responseClaro = await axios.get(apiUrl);

    // if (responseClaro.status !== 200) {
    //   throw new Error(
    //     "Error al obtener la información de la api CLARO: ",
    //     responseClaro.status
    //   );
    // }

    const data = responseClaro.data;
    return data;
  } catch (error) {
    console.log("Error en la api Claro: ", error);
  }
}

module.exports = {
  validarOp,
  titularClaro,
  titularBitel,
  titularEntel,
  titularMov,
};
