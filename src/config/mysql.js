const mysql = require('mysql2/promise');

const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3307),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'loja_de_carros'
};

let pool;

async function connectMySQL() {
  try {
    pool = mysql.createPool({
      ...MYSQL_CONFIG,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    await pool.query('SELECT 1');
    console.log('MySQL Conectado');
  } catch (error) {
    console.error('Erro ao conectar no MySQL:', error.message);
    throw error;
  }
}

function getMySQLPool() {
  if (!pool) {
    throw new Error('Pool MySQL ainda nao foi inicializado.');
  }
  return pool;
}

module.exports = { connectMySQL, getMySQLPool };
