<template>
  <div>
    <!-- Botão para abrir o modal -->
    <button @click="openModal" class="open-modal-btn">+</button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Cadastro de Maquininhas</h3>

        <form @submit.prevent="saveMaquininhas">
          <div v-for="(maquininha, index) in maquininhas" :key="index" class="maquininha-form">
            <input 
              type="text" 
              v-model="maquininha.numeroSerie" 
              placeholder="Número de Série" 
              required
            />
            <button 
              type="button" 
              @click="removeMaquininha(index)" 
              class="remove-btn"
            >
              ✖
            </button>
          </div>

          <button type="button" @click="addMaquininha" class="add-btn">+ Adicionar</button>
          <button type="submit" class="save-btn">Salvar</button>
          <button type="button" @click="closeModal" class="cancel-btn">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      showModal: false,
      maquininhas: [],
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
      if (this.maquininhas.length >= 1) {
        Swal.fire({
          icon: "warning",
          title: "Limite atingido",
          text: "Cada cliente pode ter no máximo 2 maquininhas.",
        });
        return;
      }
      this.maquininhas.push({ numeroSerie: "" });
    },
    async removeMaquininha(index) {
      const confirmacao = await Swal.fire({
        title: "Tem certeza?",
        text: "Você realmente deseja remover esta maquininha?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, remover!",
        cancelButtonText: "Cancelar",
      });

      if (confirmacao.isConfirmed) {
        this.maquininhas.splice(index, 1);
        Swal.fire("Removido!", "A maquininha foi removida com sucesso.", "success");
      }
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

<style scoped>
/* Overlay do Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Caixa do Modal */
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Botão que abre o modal */
.open-modal-btn {
  background: #322871;
  color: white;
  font-size: 16px;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.open-modal-btn:hover {
  background: #5140b5;
}

/* Estilo dos inputs */
.maquininha-form {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.maquininha-form input {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* Botões do modal */
button {
  margin-top: 10px;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

/* Botão Adicionar */
.add-btn {
  background: #322871;
  color: white;
}

.add-btn:hover {
  background: #5140b5;
}

/* Botão Salvar */
.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover {
  background: #218838;
}

/* Botão Cancelar */
.cancel-btn {
  background: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background: #c82333;
}

/* Botão de Remover (ícone X) */
.remove-btn {
  background: #dc3545;
  color: white;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #c82333;
}
</style>
