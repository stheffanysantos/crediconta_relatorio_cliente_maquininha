<template>
  <div class="app">
    <div class="main-container">
      <div class="form-container">
        <div class="image-bolota">
      <img src="@/assets/iconbolota.png" alt="icone ao lado do filtro" height="90" />
    </div>
        <h1><strong>Cadastro de Cliente</strong></h1>
        <form @submit.prevent="addCliente">
          <div class="form-group">
            <label for="cliente">Cliente:</label>
            <input type="text" id="cliente" v-model="novoCliente.Cliente" required />
          </div>
          <div class="form-group">
            <label for="maquineta">Maquineta:</label>
              <select id="maquineta" v-model="novoCliente.Maquineta" required>
                <option value="Stone">Stone</option>
              </select>
          </div>
          <div class="form-group">
            <label for="status">Status:</label>
            <select id="status" v-model="novoCliente.Status" required>
              <option value="Ativo">Ativo</option>
              <option value="Desativado">Desativado</option>
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
          <!--
          <div class="form-group">
            <label for="datafinal">Data Final:</label>
            <input type="date" id="datafinal" v-model="novoCliente.datafinal" />
          </div>
          -->
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
              <th>Maquineta</th>
              <th>Status</th>
              <th>Número de Série</th>
              <th>Data Inicial</th>
              <!--<th>Data Final</th>-->
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cliente) in clientes.filter(c => c.Status === 'Ativo')" :key="cliente.id">
              <td>{{ cliente.id }}</td>
              <td>{{ cliente.Cliente }}</td>
              <td>{{ cliente.Maquineta }}</td>
              <td>{{ cliente.Status }}</td>
              <td>{{ cliente.numeroserie }}</td>
              <td>{{ formatarData(cliente.datainicial) }}</td>
              <!--<td>{{ formatarData(cliente.DataFinal) }}</td>-->
              <td>{{ cliente.TotalPorcentage }}</td>
              <td>
                <button @click="editarCliente(cliente)" class="btn btn-edit">
                  <img src="@/assets/lapis.png" alt="Editar" class="icon-img">
                </button>

                <button @click="abrirTransferModal(cliente)">
                  <img src="@/assets/transferir.png" alt="Editar" class="icon-img">
                </button>

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
      @salvarClienteEditado="salvarClienteEditado" 
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
import Swal from "sweetalert2";

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
        Cliente: "",
        Maquineta: "",
        Status: "Ativo",
        numeroserie: "",
        datainicial: "",
        DataFinal: "",
        TotalPorcentage:"",
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
          cliente.numeroserie === this.novoCliente.numeroserie && cliente.Status.toLowerCase() === 'Ativo'
        );

        if (existeMaquininhaAtiva) {
          const confirmarTransferencia = confirm(`A maquininha ${this.novoCliente.numeroserie} já está ativada em outro cliente. Deseja transferi-la para este cliente?`);
          if (!confirmarTransferencia) {
            return;
          } else {
          
            await clienteService.updateCliente(existeMaquininhaAtiva.id, { Status: 'desativado' });
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
        // Lógica de verificação (maquininha, status, etc.) e atualização via API
        const response = await clienteService.updateCliente(clienteAtualizado.id, clienteAtualizado);
        console.log("Resposta da API ao atualizar cliente:", response);

        // Atualiza a lista local de clientes
        const index = this.clientes.findIndex((c) => c.id === clienteAtualizado.id);
        if (index !== -1) {
          this.clientes.splice(index, 1, { ...clienteAtualizado, ...response });
        }

        this.fecharModal(); // Fecha o modal após a atualização
        Swal.fire("Sucesso!", "Cliente atualizado com sucesso.", "success");
      } catch (error) {
        console.error("Erro ao salvar cliente editado:", error);
        Swal.fire("Erro!", "Erro ao salvar cliente editado. Tente novamente.", "error");
      }
    },


    async excluirCliente(index) {
      const { isConfirmed } = await Swal.fire({
        title: "Tem certeza?",
        text: "A exclusão não pode ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#412884",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      });

      if (isConfirmed) {
      try {
        const cliente = this.clientes[index];
        await clienteService.deleteCliente(cliente.id);
        this.getClientes();
        Swal.fire("Excluído!", "O cliente foi excluído com sucesso.", "success");
        } catch (error) {
          console.error("Erro ao excluir cliente:", error.response?.data || error.message);
          Swal.fire("Erro!", "Não foi possível excluir o cliente. Tente novamente.", "error");
        }
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
        status: "Ativo",
        numeroserie: "",
        datainicial: "",
        datafinal: "",
      };
    },

    editarCliente(cliente) {
      this.clienteEditado = JSON.parse(JSON.stringify(cliente)); // Clonagem profunda para evitar efeitos colaterais
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
    padding: 30px;
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
    padding: 10px; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .form-container {
    margin-right: 20px;
    padding: 20px;
    align-items: center;
    background-color: #ffffff;
  }

  .relatorio-container {
    width: 100%;
    margin-left: 0;
  }

  .image-bolota{
    display: flex;
    align-items: center;
    padding: 15px;
  }

  h1 {
    font-size: 24px;
    color: #412884;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 20px;
    color: #322871;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 16px; 
  }

  label {
    display: block;
    font-size: 14px;
    color: #412884;
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

  .icon-img {
  width:15px;
  height:15px;
  object-fit: contain;
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
    padding: 25px 20px;
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

  