import axios from "axios";

const API_URL = "http://localhost:8800/api/creditotaxa";

export default {
  async addHistoricoCredito(taxa) {
    try {
      const response = await axios.post(API_URL, taxa);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Lança o erro após o tratamento
    }
  },

  async getHistoricoCredito() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Lança o erro após o tratamento
    }
  },

  async updateHistoricoCredito(id, data) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data); // Atualização de dados
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Lança o erro após o tratamento
    }
  },

  async deleteHistoricoCredito(id) {
    try {
      await axios.delete(`${API_URL}/${id}`); // Exclusão definitiva
    } catch (error) {
      this.handleError(error);
      throw error; // Lança o erro após o tratamento
    }
  },

  handleError(error) {
    if (error.response) {
      // Erro da resposta do servidor
      console.error("Erro na resposta:", error.response.data);
      console.error("Código do erro:", error.response.status);
      console.error("Cabeçalhos:", error.response.headers);
    } else if (error.request) {
      // Erro na requisição (sem resposta)
      console.error("Erro na requisição:", error.request);
    } else {
      // Outro tipo de erro
      console.error("Erro desconhecido:", error.message);
    }
  },
};
