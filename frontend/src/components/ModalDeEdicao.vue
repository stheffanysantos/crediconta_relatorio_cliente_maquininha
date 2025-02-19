<template>
  <div v-if="isVisible" class="modal" @click.self="fecharModal">
    <div class="modal-content">
      <h2>Editar Cliente</h2>
      <form @submit.prevent="salvarClienteEditado">
        <div class="form-group-container">
          <!-- Campo Cliente (apenas visualização) -->
          <div class="form-group">
            <label for="cliente">Cliente:</label>
            <input type="text" id="cliente" v-model="clienteTemp.Cliente" required readonly />
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
              <input type="text" id="numeroserie" v-model="clienteTemp.numeroserie" readonly />
              <button type="button" @click="abrirModalMaquininhas" class="btn-icon">+</button>
            </div>
          </div>


          <!-- Campo Data Inicial (apenas visualização) -->
          <div class="form-group">
            <label for="datainicial">Data Inicial:</label>
            <input type="date" id="datainicial" v-model="clienteTemp.datainicial" required readonly />
          </div>

          <!-- Campo Data Final -->
          <div class="form-group">
            <label for="datafinal">Data Final:</label>
            <input type="date" id="datafinal" v-model="clienteTemp.datafinal" />
          </div>
        </div>

        <button type="submit" class="btn">Salvar</button>
      </form>

      <button @click="fecharModal" class="btn btn-close">Fechar</button>
    </div>

  <!-- Modal de Cadastro de Maquininhas (Interno) -->
  <div v-if="showModalMaquininhas" class="sub-modal">
    <div class="sub-modal-content">
      <h3>Adicionar Maquininha</h3>
      <div class="maquininha-list">
        <!-- Primeira maquininha (não pode ser removida) -->
        <div class="maquininha-item">
          <input type="text" v-model="maquininhas[0]" placeholder="Número de Série" readonly />
        </div>

        <!-- Segunda maquininha (pode ser removida) -->
        <div v-if="maquininhas.length > 1" class="maquininha-item">
          <input type="text" v-model="maquininhas[1]" placeholder="Número de Série" />
          <button @click="removerSegundaMaquininha" class="btn-remove">X</button>
        </div>
      </div>
      
        <button @click="addMaquininha" class="btn btn-add">Adicionar</button>
        <button @click="salvarMaquininhas" class="btn btn-save">Salvar</button>

        
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
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
      showModalMaquininhas: false,
      maquininhas: [""],
      clienteTemp: {
        numeroserie: "",
        numeroserie2: "",
        datainicial: "",
        datafinal: "",
      },
    };
  },
  watch: {
    clienteEditado: {
      handler(newCliente) {
        if (newCliente) {
          this.clienteTemp = {
            ...newCliente,
            datainicial: newCliente.datainicial ? newCliente.datainicial.split("T")[0] : "",
            datafinal: newCliente.datafinal ? newCliente.datafinal.split("T")[0] : "",
          };
          this.maquininhas = newCliente.numeroserie ? newCliente.numeroserie.split(", ") : [];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    abrirModalMaquininhas() {
      // Carrega as maquininhas do cliente para edição
      this.maquininhas = [this.clienteTemp.numeroserie, this.clienteTemp.numeroserie2].filter(Boolean);
      this.showModalMaquininhas = true;
    },

    addMaquininha() {
      if (this.maquininhas.length < 2) {
        this.maquininhas.push("");
      }
    },

    removerSegundaMaquininha() {
      if (this.maquininhas.length > 1) {
        this.maquininhas.pop();
      }
    },

    salvarMaquininhas() {
      // Define os valores das maquininhas no clienteTemp
      this.clienteTemp.numeroserie = this.maquininhas[0] || "";
      this.clienteTemp.numeroserie2 = this.maquininhas[1] || "";
      this.showModalMaquininhas = false;
    },


    formatarNumerosSerie() {
      return this.maquininhas.join(", ");
    },

    async salvarClienteEditado() {
      try {
        const response = await clienteService.updateCliente(this.clienteTemp.idzeus, this.clienteTemp);

        if (response) {
          this.$emit("atualizarClientes");
          Swal.fire("Sucesso!", "As alterações foram salvas.", "success");
        } else {
          Swal.fire("Erro!", "Erro ao atualizar cliente.", "error");
        }
      } catch (error) {
        console.error("Erro ao salvar cliente editado:", error);
        Swal.fire("Erro!", "Não foi possível salvar as alterações.", "error");
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

/* Estilos do sub-modal */
.sub-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.sub-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.maquininha-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.btn-remove {
  background-color: #6052c0;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-add {
  background: #322871;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
}

.btn-exitModal {
  margin-top: 10px;
  background: red;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
}

.btn-save {
  margin-top: 10px;
  background: green;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
}
</style>

