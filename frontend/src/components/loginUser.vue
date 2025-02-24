<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input
          type="text"
          v-model="username"
          placeholder="Usuário ou Email"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
      <p v-if="message">{{ message }}</p> 
    </div>
  </template>
  
  <script>
  import authService from '../services/authService.js';
  import Swal from 'sweetalert2'; 
  
  export default {
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          await authService.loginUser(this.username, this.password);
  
          await Swal.fire({
            title: 'Sucesso!',
            text: 'Login realizado com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
  
          this.$router.push('/dashboardMenu');
        } catch (error) {

          if (error.response) {
            const status = error.response.status;
  
            if (status === 400) {
              Swal.fire('Aviso!', 'E-mail ou senha inválidos. Por favor, tente novamente.', 'warning');
            } else if (status === 404) {
              Swal.fire('Erro!', 'Usuário não encontrado. Verifique suas credenciais.', 'error');
            } else if (status === 500) {
              Swal.fire('Erro!', 'Erro no servidor. Tente novamente mais tarde.', 'error');
            } else {
              Swal.fire('Erro!', 'Ocorreu um erro. Tente novamente.', 'error');
            }
          } else {

            Swal.fire('Erro!', 'Erro de conexão. Verifique sua internet.', 'error');
          }
        }
      },
    },
  };
  </script>
  
  
  <style scoped>

  div {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #e0e0e0; 
    border-radius: 12px; 
    text-align: center;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  }
  
  h2 {
    margin-bottom: 20px;
    font-family: 'Arial', sans-serif;
    color: #333;
    font-size: 1.8rem;
    letter-spacing: 0.5px;
  }
  
  input {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 8px; 
    font-size: 1rem;
    transition: all 0.3s ease; 
  }
  
  input:focus {
    border-color: #4CAF50; 
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.6); 
  }
  
  button {
    padding: 12px 20px;
    background-color: #4CAF50; 
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    width: 100%;
    transition: background-color 0.3s ease; 
  }
  
  button:hover {
    background-color: #45a049; 
  }
  
  p {
    margin-top: 20px;
    color: #ff5722;
    font-size: 1rem;
    font-weight: 600;
  }
  </style>
  