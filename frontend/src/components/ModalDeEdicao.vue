<template>
  <div v-if="isVisible" class="modal" @click.self="fecharModal">
    <div class="modal-content">
      <h2>Editar Cliente</h2>
      <form @submit.prevent="salvarClienteEditado">
        <div class="form-group-container">

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
            <div class="input-with-button">
              <input type="text" id="numeroserie" v-model="clienteTemp.numeroserie" required />
              <button type="button" @click="abrirCadastroMaquininhas" class="btn-icon">+</button>
            </div>
          </div>

          <div class="form-group">
            <label for="datainicial">Data Inicial:</label>
            <input type="date" id="datainicial" v-model="clienteTemp.datainicial" required />
          </div>

          <div class="form-group">
            <label for="datafinal">Data Final:</label>
            <input type="date" id="datafinal" v-model="clienteTemp.datafinal" required />
          </div>
        </div>

        <button type="submit" class="btn">Salvar</button>
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
      clienteTemp: {}, 
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

    abrirCadastroMaquininhas() {
      // Emite um evento para o componente pai abrir o modal de cadastro de maquininhas
      this.$emit("abrirCadastroMaquininhas");
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
