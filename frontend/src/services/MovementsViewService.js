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
      const response = await api.get(`/movement/${clienteId}`); // Busca movimentações do cliente pelo ID
      console.log('Resposta da busca de movimentações:', response.data);
      return response.data; // Retorna os dados das movimentações
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error.response?.data || error.message);
      throw error; // Repassa o erro para a camada superior
    }
  },
  // Função para inserir uma nova movimentação para teste
  async insertTestMovement() {
    try {
      const testMovements = [
        { cliente_id: 3, cliente_nome: 'MARQUINHOS', valor_liquido: '1000.50', movimento: 'entrada', data_movimentacao: new Date().toISOString() },
        { cliente_id: 3, cliente_nome: 'MARQUINHOS', valor_liquido: '500.25', movimento: 'saida', data_movimentacao: new Date().toISOString() },
        { cliente_id: 3, cliente_nome: 'MARQUINHOS', valor_liquido: '300.75', movimento: 'entrada', data_movimentacao: new Date().toISOString() },
        { cliente_id: 3, cliente_nome: 'MARQUINHOS', valor_liquido: '200.40', movimento: 'saida', data_movimentacao: new Date().toISOString() },
      ];
      for (const movement of testMovements) {
        await api.post('/movement', movement);
      }
      console.log('Movimentações de teste inseridas com sucesso');
    } catch (error) {
      console.error('Erro ao inserir movimentações de teste:', error.response?.data || error.message);
      throw error; // Repassa o erro para a camada superior
    }
  },
};

export default movementService;
