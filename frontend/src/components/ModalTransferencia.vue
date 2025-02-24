<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h3>Transferir Maquininha</h3>
      <p>Selecione o novo cliente para a maquininha {{ maquininhaSelecionada.numeroserie }}.</p> 
      <label for="clienteDestino">Novo Cliente:</label>
      <select v-model="clienteDestino">
        <option v-for="cliente in clientes" :key="cliente.idzeus" :value="cliente.idzeus">
          {{ cliente.cliente }}
        </option>
      </select>
      <label for="dataTransferencia">Data da Transferência:</label>
      <input type="date" v-model="dataTransferencia" />
      <div>
        <button @click="fecharModal" id="delete-button">Cancelar</button>
        <button @click="confirmarTransferencia">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script>
import transferenciaService from '@/services/transferenciaService';  

export default {
  props: {
    isVisible: Boolean,
    maquininhaSelecionada: Object,  
    clientes: Array,  
  },
  data() {
    return {
      clienteDestino: null,
      dataTransferencia: null,
    };
  },
  methods: {
    fecharModal() {
      this.$emit('fechar');
    },
    async confirmarTransferencia() {
      if (!this.clienteDestino || !this.dataTransferencia) {
        alert('Preencha todos os campos!');
        return;
      }

      const transferenciaData = {
        maquininhaId: this.maquininhaSelecionada.numeroserie,  
        clienteDestino: this.clienteDestino,
        data: this.dataTransferencia,
      };

      try {
        await transferenciaService.realizarTransferencia(transferenciaData);
        alert('Transferência realizada com sucesso!');
        this.fecharModal();
      } catch (error) {
        alert('Erro ao realizar a transferência. Tente novamente!');
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
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

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

button {
  margin-top: 10px;
}

#delete-button {
  background: #322871;
}

#delete-button:hover {
  background: #9a2e2f;
}
</style>
