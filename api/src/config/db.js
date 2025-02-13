import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Criação do pool de conexões usando variáveis do .env
const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root', 
  password:'duby@123',
  database: 'simplisaldo',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0, 
});

// Obtendo a chave secreta do JWT
const jwtSecret = 'tatu9012*';

export default pool;
export { jwtSecret }; // Exporte a chave secreta, caso precise usá-la em outro lugar
