import axios from "axios";

const API_BASE_URL = "http://localhost:8800/api/transferencia";

const transferenciaService = {
  async realizarTransferencia(transferenciaData) {
    try {
      const response = await axios.post(API_BASE_URL, transferenciaData);
      return response.data;
    } catch (error) {
      console.error("Erro ao realizar transferência:", error.response?.data || error.message);
      throw error;
    }
  },

  async getTransferencias() {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar transferências:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default transferenciaService;
