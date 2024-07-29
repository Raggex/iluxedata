const mysql = require("mysql2");

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: "161.132.37.26",
  user: "main",
  password: "main4444",
  database: "IluxeData",
  connectionLimit: 10 // Ajusta según tus necesidades
});

// Promisify para usar async/await
const promisePool = pool.promise();

module.exports = { promisePool };
