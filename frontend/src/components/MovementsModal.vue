<template>
  <div class="container">
    <h2>Relatório de Movimentações</h2>

    <!-- Filtros -->
    <div class="filters">
      <input v-model="filtros.nome" placeholder="Filtrar por nome" />
      <input v-model="filtros.id" type="number" placeholder="Filtrar por ID" />
      <input v-model="filtros.dataInicio" type="date" />
      <input v-model="filtros.dataFim" type="date" />
      <button @click="buscarMovimentacoes">Filtrar</button>
      <button @click="imprimirRelatorio">Imprimir Relatório</button>
    </div>

    <!-- Tabela -->
    <table class="table">
      <thead>
        <tr>
          <th>ID Cliente</th>
          <th>Nome</th>
          <th>Data</th>
          <th>Movimento</th>
          <th>Valor</th>
          <th>Prevenda</th>
          <th>Saldo Após</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mov in movimentacoesFiltradas" :key="mov.id">
          <td>{{ mov.cliente_id }}</td>
          <td>{{ mov.cliente_nome }}</td>
          <td>{{ formatarData(mov.data_movimentacao) }}</td>
          <td :class="mov.movimento === 'entrada' ? 'entrada' : 'saida'">{{ mov.movimento }}</td>
          <td>R$ {{ parseFloat(mov.valor_liquido).toFixed(2) }}</td>
          <td>{{ mov.prevenda || '--' }}</td>
          <td>R$ {{ parseFloat(mov.saldo_atual).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import movementService from '@/services/MovementsViewService';

export default {
  data() {
    return {
      movimentacoes: [],
      filtros: {
        nome: '',
        id: '',
        dataInicio: '',
        dataFim: ''
      }
    };
  },
  computed: {
    movimentacoesFiltradas() {
      return this.movimentacoes.filter(mov => {
        return (
          (!this.filtros.nome || mov.cliente_nome.toLowerCase().includes(this.filtros.nome.toLowerCase())) &&
          (!this.filtros.id || mov.cliente_id === parseInt(this.filtros.id)) &&
          (!this.filtros.dataInicio || new Date(mov.data_movimentacao) >= new Date(this.filtros.dataInicio)) &&
          (!this.filtros.dataFim || new Date(mov.data_movimentacao) <= new Date(this.filtros.dataFim))
        );
      });
    }
  },
  methods: {
    async buscarMovimentacoes() {
      try {
        const response = await movementService.getAllMovements();
        if (response && response.movements) {
          this.movimentacoes = response.movements;
        }
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      }
    },
    imprimirRelatorio() {
      window.print();
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString();
    }
  },
  mounted() {
    this.buscarMovimentacoes();
  }
};
</script>

  
  <style scoped>

  .container {
    font-family: 'Nunito', sans-serif;
    padding: 20px;
    display: initial;
  }
  
  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  input, button {
    padding: 10px;
    font-size: 14px;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  .entrada {
    color: green;
    font-weight: bold;
  }
  
  .saida {
    color: red;
    font-weight: bold;
  }
  </style>
  