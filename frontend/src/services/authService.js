import axios from 'axios';

const API_URL = 'http://localhost:8800/api/users';

// Função para fazer login
const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    // Salva o token no localStorage para autenticação futura
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    // Lança o erro para ser tratado no componente
    throw error.response || { message: 'Erro desconhecido durante o login.' };
  }
};

// Função para registrar um novo usuário
const registerUser = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, username, password });
    return response.data;
  } catch (error) {
    // Lança o erro para ser tratado no componente
    throw error.response || { message: 'Erro desconhecido durante o registro.' };
  }
};

// Função para obter informações do usuário autenticado (se necessário)
const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || { message: 'Erro desconhecido ao obter o perfil.' };
  }
};

// Exporta as funções como um serviço
export default {
  loginUser,
  registerUser,
  getUserProfile,
};
