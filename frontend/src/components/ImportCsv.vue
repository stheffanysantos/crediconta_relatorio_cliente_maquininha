<template>
    <div>
      <h3>Gerenciamento de Arquivos CSV</h3>
  
      <!-- Input para importar o arquivo CSV -->
      <label>Importar arquivo CSV:</label>
      <input type="file" accept=".csv" @change="importarCSV" />
      <br /><br />
  
      <!-- Botão para confirmar o envio do CSV -->
      <button @click="confirmarEnvio" :disabled="!arquivo">Confirmar Envio</button>
    </div>
  </template>
  
  <script>
  import apiService from "@/services/ImportCsvService";
  
  export default {
    data() {
      return {
        arquivo: null
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
          this.arquivo = null; // Limpa o arquivo após envio
        } catch (error) {
          console.error("Erro ao enviar CSV:", error);
          alert("Erro ao enviar o arquivo CSV.");
        }
      }
    }
  };
  </script>
  