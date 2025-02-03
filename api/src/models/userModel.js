import bcrypt from 'bcryptjs';
import connection from '../config/db.js';

// Função para criar um novo usuário
export const createUser = (userData, callback) => {
  const { email, username, password } = userData;

  // Gerar o hash da senha antes de salvar
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    connection.query(query, [email, username, hashedPassword], (err, result) => {
      if (err) return callback(err);
      callback(null, result); // Devolve o resultado da inserção
    });
  });
};

// Função para autenticar usuário
export const authenticateUser = (username, password, callback) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  
  // Consulta no banco para encontrar o usuário
  connection.query(query, [username], (err, result) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      return callback(err); // Retorna o erro caso a consulta falhe
    }

    // Verifica se o usuário foi encontrado
    if (result.length === 0) {
      console.warn('Usuário não encontrado');
      return callback(null, null); // Retorna null se não encontrar o usuário
    }

    // Comparar a senha fornecida com o hash armazenado
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) {
        console.error('Erro ao comparar a senha:', err);
        return callback(err); // Retorna erro se houver problema na comparação
      }

      // Verifica se a senha bate
      if (!isMatch) {
        console.warn('Senha incorreta');
        return callback(null, null); // Retorna null se a senha não for correta
      }

      // Se a senha bater, retorna o usuário autenticado (sem a senha)
      console.log('Senha correta');
      callback(null, { id: result[0].id, username: result[0].username });
    });
  });
};
