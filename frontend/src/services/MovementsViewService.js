import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8800/api/movement', // Base URL para o backend
  headers: {
    'Content-Type': 'application/json',
  },
});


const movementService = {

  async createMovement(movementData) {
    try {
      const response = await api.post('/', movementData); 
      console.log('Resposta da criação de movimentação:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Erro ao criar movimentação:', error.response?.data || error.message);
      throw error; 
    }
  },



  async getMovementsByClient(clienteId) {
    try {
      const response = await api.get(`/${clienteId}`); 
      console.log('Resposta da busca de movimentações:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error.response?.data || error.message);
      throw error; 
    }
  },


  async getLastModifiedClients() {
    try {
      const response = await api.get('/ultimos-modificados'); 
      console.log('Resposta dos últimos clientes modificados:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar os últimos clientes modificados:', error.response?.data || error.message);
      throw error; 
    }
  },

  async getAllMovements() {
    try {
      const response = await api.get('/clientes'); 
      console.log('Resposta dos  clientes modificados:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Erro ao buscar os  clientes modificados:', error.response?.data || error.message);
      throw error; 
    }
  },

 
  async getMovementsByClientName(cliente_nome) {
    try {
      const response = await api.get(`/clientes/${cliente_nome}`); 
      console.log('Resposta da busca por nome de cliente:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Erro ao buscar movimentações por nome de cliente:', error.response?.data || error.message);
      throw new Error('Erro ao buscar movimentações por nome de cliente: ' + error.message);
    }
  },
};

export default movementService;
