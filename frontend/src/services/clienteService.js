import axios from "axios";

const API_BASE_URL = "http://localhost:8800/api/cadastrocliente";

const clienteService = {
  async getClientes() {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error.response?.data || error.message);
      throw error;
    }
  },

  async addCliente(cliente) {
    try {
      const response = await axios.post(API_BASE_URL, cliente);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error.response?.data || error.message);
      throw error;
    }
  },

  async updateCliente(idzeus, clienteAtualizado) {
    try {
      if (!idzeus) {
        throw new Error("IDZEUS do cliente é obrigatório para atualização.");
      }

      console.log("📡 Enviando dados para atualização:", clienteAtualizado);

      const response = await axios.put(`${API_BASE_URL}/cliente/${idzeus}`, clienteAtualizado);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao atualizar cliente:", error.response?.data || error.message);
      throw error;
    }
  },

  async deleteCliente(idzeus) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${idzeus}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir cliente:", error.response?.data || error.message);
      throw error;
    }
  },

  async deactivateCliente(idzeus) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${idzeus}`, { Status: "Desativado" });
      return response.data;
    } catch (error) {
      console.error("Erro ao desativar cliente:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default clienteService;
