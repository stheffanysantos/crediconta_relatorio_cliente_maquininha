import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/upload', // Certifique-se de que é a URL correta do backend
  headers: { 'Content-Type': 'multipart/form-data' }
});

const uploadCSV = (formData) => {
  return api.post('/', formData);
};

export default {
  uploadCSV,
};
