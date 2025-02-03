<template>
  <div class="csv-container">
    <h3>Importar Arquivo CSV</h3>

    <div class="upload-section">
      <label class="file-label">Por favor importar arquivos somente no formato CSV!</label>
      <input type="file" accept=".csv" @change="importarCSV" class="file-input" />
    </div>

    <button @click="confirmarEnvio" :disabled="!arquivo" class="upload-button">Confirmar Envio</button>
  </div>
</template>

<script>
import apiService from "@/services/ImportCsvService";

export default {
  data() {
    return {
      arquivo: null,
    };
  },
  methods: {
    importarCSV(event) {
      this.arquivo = event.target.files[0];
    },

    async confirmarEnvio() {
      if (!this.arquivo) {
        alert("Nenhum arquivo selecionado!");
        return;
      }

      const formData = new FormData();
      formData.append("arquivo", this.arquivo);

      try {
        await apiService.uploadCSV(formData);
        alert("Arquivo CSV enviado com sucesso!");
        this.arquivo = null;
      } catch (error) {
        console.error("Erro ao enviar CSV:", error);
        alert("Erro ao enviar o arquivo CSV.");
      }
    },
  },
};
</script>

<style>
.csv-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

h3 {
  color: #412884;
  margin-bottom: 20px;
}

.upload-section {
  margin-bottom: 20px;
}

.file-label {
  font-size: 14px;
  color: #322871;
  display: block;
  margin-bottom: 8px;
}

.file-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.upload-button {
  background: #73ba60;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.upload-button:hover:not(:disabled) {
  background: #5d9f4b;
}
</style>
