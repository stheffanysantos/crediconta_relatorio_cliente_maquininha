import axios from 'axios';

// Base URL ajustada para permitir múltiplos endpoints relacionados a upload
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Removido o '/upload' para facilitar outras rotas
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Função para upload de arquivos CSV
const uploadCSV = (formData) => {
  return api.post('/upload', formData); // Rota de upload mantida
};

// Função para buscar os arquivos importados
const getImportedFiles = () => {
  return api.get('/imports'); // Nova rota para buscar arquivos importados
};

export default {
  uploadCSV,
  getImportedFiles, // Exportação da nova função
};
