<template>
    <div class="app">
      <div class="main-container-taxa">
        <div class="form-container-taxa">
          <h1>Cadastro de Taxas</h1>
          <form @submit.prevent="addTaxa">
            <div class="form-group-taxa">
              <label for="tipo">Tipo:</label>
              <select id="tipo" v-model="novaTaxa.tipo" required>
                <option value="">Selecione o tipo</option>
                <option value="Debito">Débito</option>
                <option value="Credito">Crédito</option>
                <option value="Pix">Pix</option>
                <option value="Alimentacao">Alimentação</option>
              </select>
            </div>
            <div class="form-group-taxa">
              <label for="bandeira">Bandeira:</label>
              <select id="bandeira" v-model="novaTaxa.bandeira" required>
                <option value="">Selecione a bandeira</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Elo">Elo</option>
                <option value="American Express">American Express</option>
                <option value="Hipercard">Hipercard</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div class="form-group-taxa">
              <label for="percentage">Porcentagem:</label>
              <input
                type="number"
                id="percentage"
                v-model="novaTaxa.percentage"
                step="0.01"
                min="0"
                placeholder="Ex.: 2.50"
                required
              />
            </div>
            <button type="submit" class="btn">Cadastrar</button>
          </form>
        </div>
  
        <div class="relatorio-container-taxa">
          <h2>Relatório de Taxas</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Bandeira</th>
                <th>Porcentagem</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(taxa, index) in taxas" :key="taxa.rate_id">
                <td>{{ taxa.rate_id }}</td>
                <td>{{ taxa.tipo }}</td>
                <td>{{ taxa.bandeira }}</td>
                <td>{{ (taxa.percentage * 100).toFixed(2) }}%</td>
                <td>{{ taxa.active ? "Sim" : "Não" }}</td>
                <td>
                  <button @click="excluirTaxa(index)" class="btn btn-delete">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import CreditotaxaService from "@/services/CreditotaxaService";
  import Swal from "sweetalert2";
  
  export default {
    data() {
      return {
        novaTaxa: { tipo: "", bandeira: "", percentage: null, active: true },
        taxas: [],
      };
    },
    methods: {
      async carregarTaxas() {
        try {
          this.taxas = await CreditotaxaService.getHistoricoCredito();
        } catch (error) {
          Swal.fire("Erro!", "Não foi possível carregar as taxas.", "error");
        }
      },
      async addTaxa() {
        const { tipo, bandeira, percentage } = this.novaTaxa;
        if (!tipo || !bandeira || percentage === null || percentage === "") {
          Swal.fire("Erro!", "Preencha todos os campos!", "error");
          return;
        }
  
        try {
          // Verificar se já existe uma taxa ativa com o mesmo tipo e bandeira
          const taxaExistente = this.taxas.find(
            (taxa) => taxa.tipo === tipo && taxa.bandeira === bandeira && taxa.active
          );
          if (taxaExistente) {
            Swal.fire("Erro!", "Já existe uma taxa ativa para essa bandeira e tipo.", "error");
            return;
          }
  
          const novaTaxa = await CreditotaxaService.addHistoricoCredito(this.novaTaxa);
          this.taxas.push({ ...this.novaTaxa, rate_id: novaTaxa.id });
          Swal.fire("Sucesso!", "Taxa cadastrada com sucesso!", "success");
          this.novaTaxa = { tipo: "", bandeira: "", percentage: null, active: true };
        } catch (error) {
          if (error.response && error.response.data.error) {
            Swal.fire("Erro!", error.response.data.error, "error");
          } else {
            Swal.fire("Erro!", "Erro ao cadastrar a taxa.", "error");
          }
        }
      },
  
      async excluirTaxa(index) {
    const taxa = this.taxas[index];
    const { isConfirmed } = await Swal.fire({
      title: "Tem certeza?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });
  
    if (isConfirmed) {
      try {
        // Enviar request para o backend para excluir definitivamente
        await CreditotaxaService.deleteHistoricoCredito(taxa.rate_id);
        // Remover a taxa da lista local após a exclusão
        this.taxas.splice(index, 1);
        Swal.fire("Sucesso!", "Taxa excluída com sucesso.", "success");
      } catch (error) {
        Swal.fire("Erro!", "Erro ao excluir a taxa.", "error");
      }
    }
  },
    },
    mounted() {
      this.carregarTaxas();
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
  
    .main-container-taxa {
      display: flex;
      gap: 20px;
      margin: 0 auto; 
      flex-direction: row;
    }
  
    .form-container-taxa, 
    .relatorio-container-taxa {
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 20px; 
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  
    .image-calculadora-taxa {
      display: flex;
      justify-content: flex-end; 
      align-items: flex-end; 
      height: 100%; 
    }
  
    .form-container-taxa {
      margin-right: 20px;
      padding: 30px;
      align-items: center;
    }
  
    .relatorio-container-taxa {
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
  
    .form-group-taxa {
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
  
    .icon-img {
      width: 20px;
      height: 15px;
      object-fit: contain;
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
      .main-container-taxa {
        flex-direction: column;
      }
  
      .form-container-taxa,
      .relatorio-container-taxa {
        width: 100%; 
        padding: 20px;
      }
  
      .app {
        max-width: 100%; 
      }
    }
  </style>
  