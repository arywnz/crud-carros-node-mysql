const mysql = require('mysql2/promise');

// Configuração do pool de conexões
const pool = mysql.createPool({
    host: 'localhost',      // se estiver no Docker, pode ser 'mysql_fullstack' ou '127.0.0.1'
    port: 3307,             // conforme seu docker-compose
    user: 'root',
    password: 'root',
    database: 'loja_de_carros',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// LISTAR TODOS OS CARROS
async function getAllCars() {
    const [rows] = await pool.query('SELECT * FROM carros');
    return rows;
}

// BUSCAR CARRO POR ID
async function getCarById(id) {
    const [rows] = await pool.query('SELECT * FROM carros WHERE id = ?', [id]);
    return rows[0];
}

// CRIAR CARRO
async function createCar(car) {
    const { modelo, marca, ano } = car;
    const [result] = await pool.query(
        'INSERT INTO carros (modelo, marca, ano) VALUES (?, ?, ?)',
        [modelo, marca, ano]
    );
    return { id: result.insertId, ...car };
}

// ATUALIZAR CARRO
async function updateCar(id, car) {
    const { modelo, marca, ano } = car;
    const [result] = await pool.query(
        'UPDATE carros SET modelo = ?, marca = ?, ano = ? WHERE id = ?',
        [modelo, marca, ano, id]
    );
    return result.affectedRows > 0;
}

// REMOVER CARRO
async function deleteCar(id) {
    const [result] = await pool.query('DELETE FROM carros WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
};