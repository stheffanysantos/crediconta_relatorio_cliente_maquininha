<template>
  <div v-if="isVisible" class="modal" @click.self="fecharModal">
    <div class="modal-content">
      <h2>Editar Cliente</h2>
      <form @submit.prevent="salvarClienteEditado">
        <div class="form-group-container">
          <!-- Campo Cliente (apenas visualização) -->
          <div class="form-group">
            <label for="cliente">Cliente:</label>
            <input
              type="text"
              id="cliente"
              v-model="clienteTemp.Cliente"
              required
              readonly
            />
          </div>

          <!-- Campo Status -->
          <div class="form-group">
            <label for="status">Status:</label>
            <select id="status" v-model="clienteTemp.Status">
              <option value="Ativo">Ativo</option>
              <option value="Desativado">Desativado</option>
            </select>
          </div>


          <!-- Campo Número de Série -->
          <div class="form-group">
            <label for="numeroserie">Número de Série:</label>
            <div class="input-with-button">
              <input
                type="text"
                id="numeroserie"
                v-model="clienteTemp.numeroserie"
                required
              />
              <button type="button" @click="showModalMaquininhas = true" class="btn-icon">+</button>
            </div>
          </div>

          <!-- Campo Data Inicial (apenas visualização) -->
          <div class="form-group">
            <label for="datainicial">Data Inicial:</label>
            <input
              type="date"
              id="datainicial"
              v-model="clienteTemp.datainicial"
              required
              readonly
            />
          </div>

          <!-- Campo Data Final -->
          <div class="form-group">
            <label for="datafinal">Data Final:</label>
            <input type="date" id="datafinal" v-model="clienteTemp.datafinal" />
          </div>
        </div>

        <!-- Modal de Cadastro de Maquininhas -->
        <ModalMaquininha v-if="showModalMaquininhas" @salvarMaquininhas="atualizarNumeroSerie" @close="showModalMaquininhas = false" />

        <button type="submit" class="btn">Salvar</button>
      </form>

      <button @click="fecharModal" class="btn btn-close">Fechar</button>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import clienteService from "@/services/clienteService";
import ModalMaquininha from "./ModalMaquininhas.vue"; // Importa o modal de maquininhas

export default {
  components: {
    ModalMaquininha,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    clienteEditado: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEditModal: false,
      showModalMaquininhas: false, // Controla a exibição do modal de maquininhas
      clienteTemp: {
        numeroserie: "",
      },
    };
  },
  watch: {
    clienteEditado: {
      handler(newCliente) {
        if (newCliente) {
          this.clienteTemp = {
            ...newCliente,
            datainicial: newCliente.datainicial
              ? newCliente.datainicial.split("T")[0]
              : "",
            datafinal: newCliente.datafinal
              ? newCliente.datafinal.split("T")[0]
              : "",
          };
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // Método para abrir o modal de maquininhas
    abrirModalMaquininhas() {
      this.showModalMaquininhas = true;
    },

    // Método para atualizar o número de série quando salvar no modal de maquininhas
    atualizarNumeroSerie(maquininhas) {
      if (maquininhas.length > 0) {
        this.clienteTemp.numeroserie = maquininhas.map(m => m.numeroSerie).join(", ");
      }
      this.showModalMaquininhas = false;
    },

    // Método de salvar cliente editado
    async salvarClienteEditado() {
      try {
        const statusAnterior = this.clienteEditado.Status;
        const novoStatus = this.clienteTemp.Status;

        // Verifica se o status mudou de "Ativo" para "Desativado"
        if (statusAnterior === "Ativo" && novoStatus === "Desativado") {
          const confirmacao = await Swal.fire({
            title: "Tem certeza?",
            text: "Você realmente deseja desativar este cliente?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, desativar!",
            cancelButtonText: "Cancelar",
          });

          // Se o usuário cancelar, reverte o status e interrompe o salvamento
          if (!confirmacao.isConfirmed) {
            this.clienteTemp.Status = statusAnterior;
            return;
          }
        }

        // Continua o salvamento se não houver bloqueios
        const clienteEnviado = { ...this.clienteTemp };
        const response = await clienteService.updateCliente(clienteEnviado.id, clienteEnviado);

        if (response) {
          this.$emit("atualizarClientes");

          // Pequeno atraso para garantir o fluxo antes de exibir o alerta de sucesso
          setTimeout(() => {
            Swal.fire("Sucesso!", "As alterações foram salvas.", "success");
          }, 300);
        } else {
          Swal.fire("Erro!", "Erro ao atualizar cliente.", "error");
        }
      } catch (error) {
        console.error("Erro ao salvar cliente editado:", error);
        Swal.fire("Erro!", "Não foi possível salvar as alterações. Tente novamente.", "error");
      }
    },

    
    // Fechar o modal
    fecharModal() {
      this.$emit("fechar");
    },
  },
};
</script>

<style scoped>

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  width: 60%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.6rem;
  font-weight: bold;
  color: #322871;
  text-align: center;
}

.form-group-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.form-group {
  width: 48%;
  margin-bottom: 8px;
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

input,
select {
  width: 100%;
  padding: 6px;
  font-size: 0.85rem;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
}

button {
  cursor: pointer;
}

.btn-icon {
  padding: 5px 10px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #322871;
  color: #fff;
  border: none;
  border-radius: 6px;
}

button[type="submit"] {
  background: #73ba60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 20px;
}

button:hover {
  opacity: 0.9;
}

.btn-close {
  background: #322871;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  align-self: flex-start;
  margin-top: 20px;
}

.btn-close:hover {
  background-color: #12283f;
}
</style>
