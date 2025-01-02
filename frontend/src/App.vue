<template>
  <div id="app">
    <div class="image-header">
      <img src="@/assets/dubyicon.png" alt="Minha Imagem" />
    </div>
    <PlanilhaClientes />
    <RodapePedido />
  </div>
</template>

<script>
import PlanilhaClientes from './components/PlanilhaClientes.vue';
import RodapePedido from './components/RodapePedido.vue';

export default {
  components: {
    RodapePedido,
    PlanilhaClientes,
  },
};
</script>

<style>
body {
  background-color: #412884; /* Cor de fundo desejada */
}

.image-header {
  display: flex;
  align-items: center;
}
</style>
