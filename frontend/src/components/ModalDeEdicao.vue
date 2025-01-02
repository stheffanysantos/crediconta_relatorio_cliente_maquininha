<template>
  <div v-if="isVisible" class="modal" @click.self="fecharModal">
    <div class="modal-content">
      <h2>Editar Cliente</h2>
      <form @submit.prevent="salvarClienteEditado">
        <div class="form-group-container">
          <!-- Campos do formulário para editar o cliente -->
          <div class="form-group">
            <label for="cliente">Cliente:</label>
            <input type="text" id="cliente" v-model="clienteTemp.cliente" required />
          </div>

          <div class="form-group">
            <label for="status">Status:</label>
            <select id="status" v-model="clienteTemp.status" required>
              <option value="ativado">Ativado</option>
              <option value="desativado">Desativado</option>
            </select>
          </div>

          <div class="form-group">
            <label for="numeroserie">Número de Série:</label>
            <input type="text" id="numeroserie" v-model="clienteTemp.numeroserie" required />
          </div>

          <div class="form-group">
            <label for="datainicial">Data Inicial:</label>
            <input type="date" id="datainicial" v-model="clienteTemp.datainicial" required />
          </div>

          <div class="form-group">
            <label for="datafinal">Data Final:</label>
            <input type="date" id="datafinal" v-model="clienteTemp.datafinal" required />
          </div>

          <button type="submit" class="btn">Salvar</button>
        </div>
      </form>
      <button @click="fecharModal" class="btn btn-close">Fechar</button>
    </div>
  </div>
</template>

<script>
import clienteService from "@/services/clienteService";

export default {
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
      clienteTemp: {}, // Inicializa clienteTemp vazio
    };
  },
  watch: {
    clienteEditado: {
      handler(newCliente) {
        if (newCliente) {
          this.clienteTemp = {
            ...newCliente, // Atualiza clienteTemp com o clienteEditado
            datainicial: newCliente.datainicial || "",
            datafinal: newCliente.datafinal || "",
          };
        }
      },
      deep: true,
    },
  },
  methods: {
  async salvarClienteEditado() {
    try {
      const clienteEnviado = {
        ...this.clienteTemp,
      };

      const response = await clienteService.updateCliente(clienteEnviado.id, clienteEnviado);
      if (response) {
        this.$emit("atualizarClientes");
        this.fecharModal();
      } else {
        alert("Erro ao atualizar cliente.");
      }
    } catch (error) {
      console.error("Erro ao salvar cliente editado:", error);
      alert("Não foi possível salvar as alterações. Tente novamente.");
    }
  },

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

input,
select,
textarea {
  width: 100%;
  padding: 6px;
  font-size: 0.85rem;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
}

textarea {
  height: 70px;
}

button {
  cursor: pointer;
}

button[type="submit"] {
  background: #73ba60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 20px;
}

button[type="button"] {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 10px;
}

button:hover {
  opacity: 0.9;
}

button[type="submit"]:hover {
  background-color: #4a9e45;
}

button[type="button"]:hover {
  background-color: #c82333;
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
