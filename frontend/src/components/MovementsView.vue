<template>
  <div class="container">
    <h2>Movimentações do Cliente</h2>

    <!-- Input para buscar o cliente -->
    <input
      v-model="searchQuery"
      placeholder="Buscar cliente..."
      @input="buscarCliente"
    />

    <div v-if="clienteSelecionado">
      <h3>{{ clienteSelecionado.nome }}</h3>
      <p><strong>Saldo Atual:</strong> R$ {{ saldoAtual.toFixed(2) }}</p>

      <!-- Tabela de Movimentações -->
      <table class="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Movimento</th>
            <th>Valor</th>
            <th>Saldo Após</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in movimentacoes" :key="mov.id">
            <td>{{ formatarData(mov.data_movimentacao) }}</td>
            <td :class="mov.movimento === 'entrada' ? 'entrada' : 'saida'">
              {{ mov.movimento }}
            </td>
            <td>R$ {{ !isNaN(parseFloat(mov.valor_liquido)) ? parseFloat(mov.valor_liquido).toFixed(2) : '0.00' }}</td>
            <td>R$ {{ !isNaN(parseFloat(mov.saldo_atual)) ? parseFloat(mov.saldo_atual).toFixed(2) : '0.00' }}</td>
          </tr>
        </tbody>
      </table>

      <button class="btn-subtrair" @click="abrirModalSaida">Subtrair Total</button>
    </div>

    <!-- Modal para realizar a saída -->
    <div v-if="mostrarModal" class="modal">
      <div class="modal-content">
        <h3>Subtrair Valor</h3>
        <input type="number" v-model="valorSaida" placeholder="Valor a subtrair" />
        <textarea v-model="comentarioSaida" placeholder="Comentário (opcional)"></textarea>
        <button @click="realizarSaida">Confirmar</button>
        <button class="btn-close" @click="mostrarModal = false">Fechar</button>
      </div>
    </div>
  </div>
</template>


<script>
import movementService from '@/services/MovementsViewService';

export default {
  data() {
    return {
      searchQuery: '', // A busca será por cliente_id
      clienteSelecionado: null,
      movimentacoes: [],
      saldoAtual: 0,
      mostrarModal: false,
      valorSaida: 0,
    };
  },
  methods: {
    // Função para buscar o cliente e suas movimentações
    async buscarCliente() {
      console.log('Iniciando a busca do cliente...');
      if (!this.searchQuery) {
        alert("Por favor, insira um ID de cliente.");
        return;
      }

      try {
        const clienteId = parseInt(this.searchQuery);
        console.log('ID do cliente:', clienteId);
        if (isNaN(clienteId)) {
          alert("O ID do cliente deve ser um número válido.");
          return;
        }

        // Chamada ao serviço para obter as movimentações
        console.log('Chamando getMovementsByClient com ID do cliente:', clienteId);
        const data = await movementService.getMovementsByClient(clienteId);
        console.log('Dados retornados de getMovementsByClient:', data);

        if (data && data.length) {
          this.clienteSelecionado = {
            nome: data[0].cliente_nome,
            id: data[0].cliente_id,
          };
          this.movimentacoes = data;
          // Garantir que saldoAtual seja um número (parseFloat)
          this.saldoAtual = parseFloat(data[0].saldo_atual) || 0;
          console.log('Cliente selecionado:', this.clienteSelecionado);
          console.log('Movimentações:', this.movimentacoes);
          console.log('Saldo atual:', this.saldoAtual);
        } else {
          this.clienteSelecionado = null;
          this.movimentacoes = [];
          this.saldoAtual = 0;
          console.log('Nenhuma movimentação encontrada para o cliente.');
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        alert("Erro ao buscar cliente.");
      }
    },

    // Função para abrir o modal de saída
    abrirModalSaida() {
      this.mostrarModal = true;
      console.log('Modal de saída aberto.');
    },

    // Função para realizar a saída de valor
    async realizarSaida() {
      console.log('Iniciando a saída de valor...');
      // Verificando se o valor de saída é válido
      if (isNaN(this.valorSaida) || this.valorSaida <= 0) {
        alert("Por favor, insira um valor válido para a saída.");
        return;
      }

      // Verificando se o valor da saída é maior que o saldo
      if (this.valorSaida > this.saldoAtual) {
        alert('Saldo insuficiente!');
        return;
      }

      try {
        const movimentoData = {
          cliente_id: this.clienteSelecionado.id,
          cliente_nome: this.clienteSelecionado.nome,
          movimento: 'saida',
          valor_liquido: parseFloat(this.valorSaida), // Garantindo que o valor seja um número
        };

        console.log('Dados do movimento:', movimentoData);

        // Usando o serviço api para criar uma nova movimentação
        const response = await movementService.createMovement(movimentoData);
        console.log('Resposta do createMovement:', response);

        if (response && response.success) { // Verifique se a resposta possui uma estrutura adequada
          this.buscarCliente(); // Recarrega as movimentações após a saída
          this.mostrarModal = false;
          this.valorSaida = 0; // Reseta o valor da saída
          console.log('Saída realizada com sucesso.');
        } else {
          alert('Erro ao processar saída');
        }
      } catch (error) {
        console.error('Erro ao subtrair valor:', error);
        alert("Erro ao processar a saída.");
      }
    },

    // Função para formatar data no formato brasileiro
    formatarData(data) {
      return new Date(data).toLocaleDateString(); // Retorna a data formatada em formato brasileiro
    },

    // Função para inserir movimentações de teste
    async inserirMovimentacoesTeste() {
      try {
        await movementService.insertTestMovement();
        console.log('Movimentações de teste inseridas com sucesso.');
      } catch (error) {
        console.error('Erro ao inserir movimentações de teste:', error);
      }
    },
  },
};
</script>




<style scoped>
.container {
  font-family: 'Nunito', sans-serif;
  max-width: 90%;
  background: #f4f7fb;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

input,
button {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

input {
  background-color: #f9f9f9;
}

button {
  cursor: pointer;
  background: #73ba60;
  color: white;
  border: none;
  transition: background-color 0.3s;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
}

.btn-close {
  margin-top: 10px;
  background: #dc3545;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-close:hover {
  background: #a02a30;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.table th {
  background-color: #f4f7fb;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

.entrada {
  color: green;
}

.saida {
  color: red;
}
</style>
