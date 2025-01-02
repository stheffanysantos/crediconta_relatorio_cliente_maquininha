import axios from "axios";

const API_BASE_URL = "http://localhost:8800/api/cadastrocliente";  // Verifique se a URL está correta

const clienteService = {
  async getClientes() {
    try {
      const response = await axios.get(API_BASE_URL);
      console.log("Resposta da API ao buscar clientes:", response);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error.response?.data || error.message);
      throw error;
    }
  },

  async addCliente(cliente) {
    try {
      const response = await axios.post(API_BASE_URL, cliente);
      console.log("Resposta da API ao adicionar cliente:", response);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error.response?.data || error.message);
      throw error;
    }
  },

  async updateCliente(id, clienteAtualizado) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, clienteAtualizado);
      console.log("Resposta da API ao atualizar cliente:", response);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error.response?.data || error.message);
      throw error;
    }
  },

  async deleteCliente(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      console.log("Resposta da API ao excluir cliente:", response);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir cliente:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default clienteService;