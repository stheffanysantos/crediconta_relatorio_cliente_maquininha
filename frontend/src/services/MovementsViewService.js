// MovementsViewService.js
import axios from 'axios';

// Configuração da URL base do seu backend
const api = axios.create({
  baseURL: 'http://localhost:8800/api', // Base URL para o backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviço para interagir com as movimentações
const movementService = {
  // Função para criar uma nova movimentação
  async createMovement(movementData) {
    try {
      const response = await api.post('/movement', movementData); // Envia dados de movimentação
      console.log('Resposta da criação de movimentação:', response.data);
      return response.data; // Retorna a resposta da criação da movimentação
    } catch (error) {
      console.error('Erro ao criar movimentação:', error.response?.data || error.message);
      throw error; // Repassa o erro para a camada superior
    }
  },


  // Função para buscar movimentações por cliente
  async getMovementsByClient(clienteId) {
    try {
      const response = await api.get(`/movement/${clienteId}`); // A URL já está configurada para passar o idZeus
      console.log('Resposta da busca de movimentações:', response.data);
      return response.data; // Retorna os dados das movimentações
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error.response?.data || error.message);
      throw error; // Repassa o erro para a camada superior
    }
  },

  // Função para buscar os últimos 6 clientes modificados
  async getLastModifiedClients() {
    try {
      const response = await api.get('/movement/ultimos-modificados'); // Rota que busca os últimos 6 clientes modificados
      console.log('Resposta dos últimos clientes modificados:', response.data);
      return response.data; // Retorna os dados dos últimos clientes modificados
    } catch (error) {
      console.error('Erro ao buscar os últimos clientes modificados:', error.response?.data || error.message);
      throw error; // Repassa o erro para a camada superior
    }
  },

  async getAllMovements() {
    try {
      const response = await api.get('/movement/clientes'); 
      console.log('Resposta dos  clientes modificados:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Erro ao buscar os  clientes modificados:', error.response?.data || error.message);
      throw error; // Repassa o erro para a camada superior
    }
  },

};

export default movementService;
