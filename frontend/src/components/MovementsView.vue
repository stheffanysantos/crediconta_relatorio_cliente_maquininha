<template>
  <div class="container">
    <div class="content-wrapper">
      <div class="image-container">
        <img src="@/assets/calculadoraicon.png" alt="Ícone da Calculadora" />
      </div>

      <div class="main-content">
        <h2>Movimentações do Cliente</h2>

        <input
          v-model="searchQuery"
          placeholder="Buscar cliente..."
          @input="buscarCliente"
        />

        <div v-if="clienteSelecionado">
          <h3>{{ clienteSelecionado.nome }}</h3>
          <p><strong>Saldo Atual:</strong> R$ {{ saldoAtual.toFixed(2) }}</p>

          <div v-if="movimentacoes.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Movimento</th>
                  <th>Valor</th>
                  <th>Prevenda</th>
                  <th>Saldo Após</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mov in movimentacoes" :key="mov.id">
                  <td>{{ formatarData(mov.data_movimentacao) }}</td>
                  <td :class="mov.movimento === 'entrada' ? 'entrada' : 'saida'">
                    {{ mov.movimento }}
                  </td>
                  <td>R$ {{ parseFloat(mov.valor_liquido).toFixed(2) }}</td>
                  <td>{{ mov.prevenda || '--' }}</td>
                  <td>R$ {{ parseFloat(mov.saldo_atual).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else>Nenhuma movimentação encontrada para este cliente.</p>

          <button class="btn-adicionar" @click="abrirModalEntrada">Adicionar Valor</button>
          <button class="btn-subtrair" @click="abrirModalSaida">Subtrair Valor</button>
        </div>


        <!-- Modal de Entrada -->
        <div v-if="mostrarModalEntrada" class="modal-overlay">
          <div class="modal-content animate-slide-down">
            <span class="close" @click="mostrarModalEntrada = false">&times;</span>
            <h3>Adicionar Entrada</h3>
            <input v-model="valorEntrada" type="number" placeholder="Valor da entrada" />
            <button class="btn-confirm" @click="realizarEntrada">Adicionar</button>
          </div>
        </div>

        <!-- Modal de Saída -->
        <div v-if="mostrarModalSaida" class="modal-overlay">
          <div class="modal-content animate-slide-down">
            <span class="close" @click="mostrarModalSaida = false">&times;</span>
            <h3>Subtrair Saída</h3>
            <input v-model="valorSaida" type="number" placeholder="Valor da saída" />
            <input v-model="prevenda" type="text" placeholder="Prevenda (Obrigatório)" />
            <button class="btn-confirm" @click="realizarSaida">Subtrair</button>
          </div>
        </div>

        <div>
          <h3>Últimos Clientes Modificados</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Data</th>
                <th>Movimento</th>
                <th>Valor</th>
                <th>Prevenda</th>
                <th>Saldo Após</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in ultimoClientes" :key="cliente.cliente_id">
                <td>{{ cliente.cliente_nome }}</td>
                <td>{{ formatarData(cliente.data_movimentacao) }}</td>
                <td :class="cliente.movimento === 'entrada' ? 'entrada' : 'saida'">
                  {{ cliente.movimento }}
                </td>
                <td>R$ {{ parseFloat(cliente.valor_liquido).toFixed(2) }}</td>
                <td>{{ cliente.prevenda || '--' }}</td>
                <td>R$ {{ parseFloat(cliente.saldo_atual).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import movementService from '@/services/MovementsViewService';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      searchQuery: '',
      clienteSelecionado: null,
      movimentacoes: [],
      saldoAtual: 0,
      mostrarModalEntrada: false,
      mostrarModalSaida: false,
      valorEntrada: 0,
      valorSaida: 0,
      prevenda: '',
      ultimoClientes: [],
    };
  },
  methods: {
    async buscarCliente() {
      if (!this.searchQuery) return;
      try {
        const clienteId = parseInt(this.searchQuery);
        if (isNaN(clienteId)) {
          alert("O ID do cliente deve ser um número válido.");
          return;
        }
        const data = await movementService.getMovementsByClient(clienteId);
        if (data) {
          this.clienteSelecionado = { nome: data.cliente_nome, id: clienteId };
          this.movimentacoes = data.movimentacoes || [];
          this.saldoAtual = parseFloat(data.totalPorcentage) || 0;
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      }
    },

    async buscarUltimosClientes() {
      try {
        const response = await movementService.getLastModifiedClients();
        if (response && response.clients) {
          this.ultimoClientes = response.clients;
        }
      } catch (error) {
        console.error('Erro ao buscar últimos clientes:', error);
      }
    },

    abrirModalEntrada() {
      this.mostrarModalEntrada = true;
    },

    abrirModalSaida() {
      this.mostrarModalSaida = true;
    },

    async realizarEntrada() {
      if (isNaN(this.valorEntrada) || this.valorEntrada <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Valor inválido',
          text: 'Por favor, insira um valor válido para a entrada.',
        });
        return;
      }

      try {
        const movimentoData = {
          cliente_id: this.clienteSelecionado.id,
          cliente_nome: this.clienteSelecionado.nome,
          movimento: 'entrada',
          valor_liquido: parseFloat(this.valorEntrada),
        };

        await movementService.createMovement(movimentoData);
        this.buscarCliente();
        this.mostrarModalEntrada = false;
        this.valorEntrada = 0;

        // SweetAlert de Sucesso
        Swal.fire({
          icon: 'success',
          title: 'Entrada efetuada com sucesso!',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        console.error('Erro ao adicionar valor:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao processar a entrada',
          text: 'Ocorreu um erro inesperado. Tente novamente.',
        });
      }
    },

    async realizarSaida() {
      if (isNaN(this.valorSaida) || this.valorSaida <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Valor inválido',
          text: 'Por favor, insira um valor válido para a saída.',
        });
        return;
      }

      if (!this.prevenda.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Campo obrigatório',
          text: 'O campo de prevenda deve ser preenchido.',
        });
        return;
      }

      if (this.valorSaida > this.saldoAtual) {
        Swal.fire({
          icon: 'error',
          title: 'Saldo insuficiente',
          text: 'O valor da saída excede o saldo atual.',
        });
        return;
      }

      try {
        const movimentoData = {
          cliente_id: this.clienteSelecionado.id,
          cliente_nome: this.clienteSelecionado.nome,
          movimento: 'saida',
          valor_liquido: parseFloat(this.valorSaida),
          prevenda: this.prevenda,
        };

        await movementService.createMovement(movimentoData);
        this.buscarCliente();
        this.mostrarModalSaida = false;
        this.valorSaida = 0;
        this.prevenda = '';

        // SweetAlert de Sucesso
        Swal.fire({
          icon: 'success',
          title: 'Saída efetuada com sucesso!',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        console.error('Erro ao subtrair valor:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao processar a saída',
          text: 'Ocorreu um erro inesperado. Tente novamente.',
        });
      }
    },

    formatarData(data) {
      return new Date(data).toLocaleDateString();
    },
  },
  mounted() {
    this.buscarUltimosClientes();
  },
};
</script>

<style scoped>
.container {
  font-family: 'Nunito', sans-serif;
  max-width: 95%;
  background: #f4f7fb;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.content-wrapper {
  display: flex; /* Alinha a imagem e o conteúdo lado a lado */
  align-items: flex-start;
  gap: 20px; /* Espaço entre a imagem e o conteúdo */
}

.image-container {
  flex: 0 0 150px; /* Define um tamanho fixo para a imagem */
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  height: auto;
  border-radius: 10px;
}

.main-content {
  flex: 1; /* O conteúdo ocupa o espaço restante */
}

input,
button {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
}

input {
  background-color: #f9f9f9;
  width: 100%;
}

button {
  cursor: pointer;
  background: #73ba60;
  color: white;
  border: none;
  transition: background-color 0.3s;
  margin-right: 10px;
}

button:hover {
  background: #5d9f4b;
}

.btn-subtrair {
  background: #dc3545;
}

.btn-subtrair:hover {
  background: #a02a30;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.table th {
  background-color: #f4f7fb;
  color: #322871;
  font-weight: bold;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

.entrada {
  color: green;
  font-weight: bold;
}

.saida {
  color: red;
  font-weight: bold;
}

/* Fundo escurecido */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Fundo escuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Conteúdo do Modal */
.modal-content {
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;
  position: relative;
  transform: translateY(-20px);
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

/* Animação de Entrada */
.animate-slide-down {
  transform: translateY(0);
  opacity: 1;
}

/* Botão de Fechar */
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  transition: color 0.3s ease;
}

.close:hover {
  color: #000;
}

/* Estilização dos Inputs */
.modal-content input {
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border 0.3s ease;
}

.modal-content input:focus {
  border-color: #007bff;
}

/* Botão de Confirmação */
.btn-confirm {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-confirm:hover {
  background-color: #0056b3;
}
</style>