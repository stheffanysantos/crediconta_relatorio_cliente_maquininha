import { createUser, authenticateUser } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Certifique-se de que esta linha está presente
import connection from "../config/db.js";

// Função para registrar um usuário
export const registerUser = (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  // Gerar o hash da senha antes de salvar
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao gerar hash da senha:', err);
      return res.status(500).send('Erro ao processar senha');
    }

    const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    connection.query(query, [email, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Erro ao inserir usuário no banco:', err);
        return res.status(500).send('Erro ao criar usuário');
      }

      res.status(201).send('Usuário criado com sucesso!');
    });
  });
};

export const loginUser = (req, res) => {
  console.log('Dados recebidos no login:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Usuário e senha são obrigatórios!');
  }

  // A partir daqui, a autenticação do usuário será feita
  authenticateUser(username, password, (err, user) => {
    if (err) {
      console.error('Erro ao autenticar usuário:', err);
      return res.status(500).send('Erro ao autenticar usuário');
    }

    if (!user) {
      console.warn('Credenciais inválidas');
      return res.status(401).send('Credenciais inválidas');
    }

    // Se o usuário for autenticado com sucesso, gera o token
    const token = jwt.sign({ id: user.id, username: user.username }, 'secretKey', { expiresIn: '1h' });
    console.log('Login bem-sucedido, token gerado:', token);

    // Retorna o token gerado
    res.status(200).json({ token });
  });
};
