import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Criação do pool de conexões usando variáveis do .env
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Usando variáveis do .env
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexões no pool
  queueLimit: 0, // Sem limite de filas
});

// Obtendo a chave secreta do JWT
const jwtSecret = process.env.JWT_SECRET;

export default pool;
export { jwtSecret }; // Exporte a chave secreta, caso precise usá-la em outro lugar
