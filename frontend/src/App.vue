<template>
  <div id="app">
    <div class="image-header">
      <img src="@/assets/dubyicon.png" alt="Minha Imagem" />
    </div>
    <PlanilhaClientes />
    <CreditoTaxa />
    <RodapePedido />
  </div>
</template>

<script>
import CreditoTaxa from './components/CreditoTaxa.vue';
import PlanilhaClientes from './components/PlanilhaClientes.vue';
import RodapePedido from './components/RodapePedido.vue';


export default {
  components: {
    RodapePedido,
    PlanilhaClientes,
    CreditoTaxa,
  },
};
</script>

<style>
body {
  background-color: #412884; /* Cor de fundo desejada */
}

.image-header {
  display: flex;
  justify-content: flex-end; /* Move para a direita */
  align-items: flex-end; /* Mantém alinhado na parte inferior */
  height: 100%; /* Certifique-se de que o contêiner ocupe toda a altura */
}
</style>
