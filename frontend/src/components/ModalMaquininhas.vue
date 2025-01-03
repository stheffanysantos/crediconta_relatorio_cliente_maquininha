<template>
    <div>
      <button @click="openModal">+</button>
  
      <!-- Modal -->
      <div v-if="showModal" class="modal">
        <h3>Cadastro de Maquininhas</h3>
        <form @submit.prevent="saveMaquininhas">
          <div v-for="(maquininha, index) in maquininhas" :key="index" class="maquininha-form">
            <label>
              Número de Série:
              <input type="text" v-model="maquininha.numeroSerie" placeholder="Digite o número de série" />
            </label>
            <button type="button" @click="removeMaquininha(index)" v-if="maquininhas.length > 1">
              Remover
            </button>
          </div>
          <button type="button" @click="addMaquininha">+ Adicionar Número de Série</button>
          <button type="submit">Salvar</button>
          <button type="button" @click="closeModal">Cancelar</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        showModal: false,
        maquininhas: [
          {
            numeroSerie: "",
          },
        ],
      };
    },
    methods: {
      openModal() {
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      addMaquininha() {
        this.maquininhas.push({ numeroSerie: "" });
      },
      removeMaquininha(index) {
        this.maquininhas.splice(index, 1);
      },
      saveMaquininhas() {
      
        this.$emit("salvarMaquininhas", this.maquininhas);
        console.log("Números de série cadastrados:", this.maquininhas);
        alert("Números de série salvos com sucesso!");
        this.closeModal();
      },
    },
  };
  </script>
  
  <style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .maquininha-form {
    margin-bottom: 15px;
  }
  
  button[type="button"] {
    cursor: pointer;
    background-color: #73ba60;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  button[type="button"]:hover {
    opacity: 0.8;
  }
  
  button[type="submit"] {
    background-color: #73ba60;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    margin-top: 10px;
  }
  
  button[type="submit"]:hover {
    opacity: 0.8;
  }
  
  button[type="button"] {
    background-color: #dc3545;
  }
  
  button[type="button"]:hover {
    background-color: #c82333;
  }
  </style>
  