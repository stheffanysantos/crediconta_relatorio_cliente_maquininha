<template>
  <div class="csv-container">
    <div class="content-wrapper">
      <div class="import-section">
        <h3>Importar Arquivo CSV</h3>

        <div class="upload-section">
          <label class="file-label">Por favor, importe arquivos somente no formato CSV!</label>
          <input type="file" accept=".csv" @change="importarCSV" class="file-input" />
        </div>

        <button @click="confirmarEnvio" :disabled="!arquivo || loading" class="upload-button">
          <span v-if="loading" class="loading-icon"></span>
          <span v-else>Confirmar Envio</span>
        </button>
      </div>

      <div class="imported-files-section">
        <h4>Últimos Arquivos Importados</h4>
        <table class="imported-files-table">
          <thead>
            <tr>
              <th>Nome do Arquivo</th>
              <th>Data de Importação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(arquivo, index) in arquivosImportados" :key="index">
              <td>{{ arquivo.filename }}</td>
              <td>{{ formatarData(arquivo.upload_date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "@/services/ImportCsvService";

export default {
  data() {
    return {
      arquivo: null,
      loading: false,
      arquivosImportados: [], // Lista de arquivos importados
    };
  },

  methods: {
    importarCSV(event) {
      this.arquivo = event.target.files[0]; // Seleciona o arquivo CSV
    },

    async confirmarEnvio() {
      if (!this.arquivo) {
        alert("Nenhum arquivo selecionado!");
        return;
      }

      const formData = new FormData();
      formData.append("arquivo", this.arquivo);

      this.loading = true; // Inicia o carregamento

      try {
        const response = await apiService.uploadCSV(formData);
        alert(response.message); // Mostra a mensagem de sucesso do backend

        this.arquivo = null;
        this.buscarArquivosImportados(); // Atualiza a lista após o envio
      } catch (error) {
        console.error("Erro ao enviar CSV:", error);
        alert("Erro ao enviar o arquivo CSV.");
      } finally {
        this.loading = false; // Finaliza o carregamento
      }
    },

    async buscarArquivosImportados() {
    try {
      const response = await apiService.getImportedFiles();
      if (response && response.data && response.data.arquivosImportados) {
        this.arquivosImportados = response.data.arquivosImportados; // Acessando corretamente a estrutura da resposta
      }
    } catch (error) {
      console.error("Erro ao buscar arquivos importados:", error);
    }
  },


    formatarData(data) {
      const date = new Date(data);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },

  mounted() {
    this.buscarArquivosImportados(); // Busca os arquivos ao carregar a página
  },
};
</script>


<style>
.csv-container {
  justify-content: center;
  padding: 20px;
  background: #f9f9f9;
}

.content-wrapper {
  display: flex;
  gap: 20px;
}

.import-section, .imported-files-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

h3, h4 {
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

.imported-files-table {
  width: 100%;
  border-collapse: collapse;
}

.imported-files-table th, .imported-files-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.imported-files-table th {
  background-color: #f2f2f2;
}

.loading-icon {
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #412884;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
