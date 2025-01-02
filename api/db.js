import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',  // Ajuste para o host do seu banco de dados
  user: 'root',       // Ajuste para seu usuário do banco
  password: 'tatu9012',  // Ajuste para sua senha
  database: 'simplisaldo'  // Ajuste para o nome do seu banco de dados
});

export default db;
