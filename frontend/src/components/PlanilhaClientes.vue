<template>
  <div class="app">
    <div class="main-container">
      <div class="form-container">
        <h1><strong>Cadastro de Cliente</strong></h1>
        <form @submit.prevent="addCliente">
          <div class="form-group">
            <label for="cliente">Cliente:</label>
            <input type="text" id="cliente" v-model="novoCliente.cliente" required />
          </div>
          <div class="form-group">
            <label for="status">Status:</label>
            <select id="status" v-model="novoCliente.status" required>
              <option value="ativado">Ativado</option>
              <option value="desativado">Desativado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="numeroserie">Número de Série:</label>
            <input type="text" id="numeroserie" v-model="novoCliente.numeroserie" required />
          </div>
          <div class="form-group">
            <label for="datainicial">Data Inicial:</label>
            <input type="date" id="datainicial" v-model="novoCliente.datainicial" required />
          </div>
          <div class="form-group">
            <label for="datafinal">Data Final:</label>
            <input type="date" id="datafinal" v-model="novoCliente.datafinal" required />
          </div>
          <button type="submit" class="btn">Cadastrar</button>
        </form>
      </div>

      <div class="relatorio-container">
        <h2>Relatório de Clientes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Número de Série</th>
              <th>Data Inicial</th>
              <th>Data Final</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cliente, index) in clientes" :key="cliente.id">
              <td>{{ cliente.id }}</td>
              <td>{{ cliente.cliente }}</td>
              <td>{{ cliente.status }}</td>
              <td>{{ cliente.numeroserie }}</td>
              <td>{{ formatarData(cliente.datainicial) }}</td>
              <td>{{ formatarData(cliente.datafinal) }}</td>
              <td>
                <button @click="editarCliente(index)" class="btn btn-edit">Editar</button>
                <button @click="excluirCliente(index)" class="btn btn-delete">Excluir</button>
                <button @click="abrirTransferModal(cliente)">Transferir Maquininha</button>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Edição -->
    <ModalDeEdicao
      :isVisible="isEditing"
      :clienteEditado="clienteEditado"
      @fechar="fecharModal"
      @salvar="salvarClienteEditado"
    />

    <modal-transferencia
      v-if="isTransferModalVisible"
      :isVisible="isTransferModalVisible"
      :maquininhaSelecionada="maquininhaSelecionada" 
      :clientes="clientes"
      @fechar="fecharTransferModal"
      @realizarTransferencia="realizarTransferencia"
    />

  </div>
</template>

<script>
import ModalDeEdicao from './ModalDeEdicao.vue';
import ModalTransferencia from './ModalTransferencia.vue';
import clienteService from "@/services/clienteService";
import transferenciaService from "@/services/transferenciaService"; 

export default {
  components: {
    ModalDeEdicao,
    ModalTransferencia, 
  },
  data() {
    return {
      clientes: [],
      isEditing: false,
      clienteEditado: null,
      isTransferModalVisible: false, 
      maquininhaSelecionada: null, 
      novoCliente: {
        cliente: "",
        status: "ativado",
        numeroserie: "",
        datainicial: "",
        datafinal: "",
      },
    };
  },
  methods: {
    async getClientes() {
      try {
        const response = await clienteService.getClientes();
        console.log("Clientes carregados:", response); 
        this.clientes = response;
      } catch (error) {
        console.error("Erro ao carregar clientes:", error.response?.data || error.message);
      }
    },

    async addCliente() {
      try {
        const existeMaquininhaAtiva = this.clientes.find(cliente => 
          cliente.numeroserie === this.novoCliente.numeroserie && cliente.status === 'ativado'
        );

        if (existeMaquininhaAtiva) {
          const confirmarTransferencia = confirm(`A maquininha ${this.novoCliente.numeroserie} já está ativada em outro cliente. Deseja transferi-la para este cliente?`);
          if (!confirmarTransferencia) {
            return;
          } else {
          
            await clienteService.updateCliente(existeMaquininhaAtiva.id, { status: 'desativado' });
          }
        }

        const response = await clienteService.addCliente(this.novoCliente);
        console.log("Resposta da API ao adicionar cliente:", response);

        if (response && response.id) {
          this.resetForm();
          this.getClientes(); 
        } else {
          console.error("Cliente adicionado não possui um id:", response);
          alert("Erro ao adicionar cliente. Cliente adicionado não possui um id.");
        }
      } catch (error) {
        console.error("Erro ao adicionar cliente:", error.response?.data || error.message);
        alert("Erro ao adicionar cliente. Verifique os logs para mais detalhes.");
      }
    },

    async salvarClienteEditado(clienteAtualizado) {
      try {
        const existeMaquininhaAtiva = this.clientes.find(cliente => 
          cliente.numeroserie === clienteAtualizado.numeroserie && cliente.status === 'ativado' && cliente.id !== clienteAtualizado.id
        );

        if (existeMaquininhaAtiva) {
          const confirmarTransferencia = confirm(`A maquininha ${clienteAtualizado.numeroserie} já está ativada em outro cliente. Deseja transferi-la para este cliente?`);
          if (!confirmarTransferencia) {
            return;
          } else {

            await clienteService.updateCliente(existeMaquininhaAtiva.id, { status: 'desativado' });
          }
        }

        const response = await clienteService.updateCliente(clienteAtualizado.id, clienteAtualizado);
        console.log("Resposta da API ao atualizar cliente:", response);

        const index = this.clientes.findIndex((c) => c.id === clienteAtualizado.id);
        if (index !== -1) {
          this.clientes.splice(index, 1, { ...clienteAtualizado, ...response });
          this.fecharModal();
          this.getClientes(); 
        } else {
          console.error("Cliente a ser editado não encontrado:", clienteAtualizado);
          alert("Erro ao salvar cliente editado. Cliente não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao salvar cliente editado:", error.response?.data || error.message);
        alert("Erro ao salvar cliente editado. Verifique os logs para mais detalhes.");
      }
    },

    async excluirCliente(index) {
      try {
        const cliente = this.clientes[index];
        await clienteService.deleteCliente(cliente.id);
        this.getClientes();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error.response?.data || error.message);
        alert("Erro ao excluir cliente. Verifique os logs para mais detalhes.");
      }
    },
    

    formatarData(data) {
      if (!data) return "";
      const date = new Date(data);
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },

    resetForm() {
      this.novoCliente = {
        cliente: "",
        status: "ativado",
        numeroserie: "",
        datainicial: "",
        datafinal: "",
      };
    },

    editarCliente(index) {
      this.clienteEditado = { ...this.clientes[index] };
      this.isEditing = true;
    },

    fecharModal() {
      this.isEditing = false;
      this.clienteEditado = null;
    },

    atualizarClientes() {
      this.getClientes();
    },

    // Abrir o modal de transferência
    abrirTransferModal(cliente) {
      this.maquininhaSelecionada = cliente;
      this.isTransferModalVisible = true;
    },
        // Fechar o modal de transferência
    fecharTransferModal() {
      this.isTransferModalVisible = false;
      this.maquininhaSelecionada = null;
    },

    // Realizar a transferência da maquininha
    async realizarTransferencia(clienteDestino) {
      try {
        const payload = {
          clienteDestino: clienteDestino,
          maquininhaId: this.maquininhaSelecionada.numeroserie,
        };

        // Chama a API para realizar a transferência
        await transferenciaService.realizarTransferencia(payload);

        // Atualiza a lista de clientes após a transferência
        this.getClientes();
        this.fecharTransferModal();
        alert("Transferência realizada com sucesso!");
      } catch (error) {
        console.error("Erro ao realizar a transferência:", error.response?.data || error.message);
        alert("Erro ao realizar a transferência. Verifique os logs para mais detalhes.");
      }
    },
  },

  created() {
    this.getClientes();
  },
};
</script>


<style>
  @import url(https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);

  .app {
    font-family: Nunito, Tahoma, Geneva, Verdana, sans-serif;
    margin: 20px auto;
    max-width: 90%; 
    background: #f4f7fb;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  }

  .main-container {
    display: flex;
    gap: 20px;
    margin: 0 auto; 
  }

  .form-container, 
  .relatorio-container {
    background: #ffffff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .form-container {
    margin-right: 20px;
    padding: 30px;
    align-items: center;
  }

  .relatorio-container {
    width: 100%;
    margin-left: 0;
  }

  h1 {
    font-size: 24px;
    color: #12283f;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 20px;
    color: #12283f;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 16px; 
  }

  label {
    display: block;
    font-size: 14px;
    color: #322871;
    margin-bottom: 6px; 
  }

  input, select, textarea, button {
    width: 100%;
    padding: 8px; 
    margin-top: 6px; 
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }

  input, select, textarea {
    background-color: #f9f9f9;
  }

  button {
    cursor: pointer;
    background: #73ba60;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    transition: background-color 0.3s;
  }

  button:hover {
    background: #5d9f4b;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }

  th, td {
    text-align: left;
    padding: 7px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #412884;
    color: white;
  }

  tr:hover {
    background-color: #f4f4f4;
  }

  .btn {
    padding: 10px 15px;
    border-radius: 5px;
  }

  .btn-edit {
    background: #412884;
    color: white;
  }

  .btn-delete {
    background: #dc3545;
    color: white;
  }

  .btn-edit:hover {
    background: #322871;
  }

  .btn-delete:hover {
    background: #9a2e2f;
  }

  
  @media (max-width: 768px) {
    .main-container {
      flex-direction: column;
    }

    .form-container,
    .relatorio-container {
      width: 100%; 
      padding: 20px;
    }

    .app {
      max-width: 100%; 
    }
  }
</style>

  