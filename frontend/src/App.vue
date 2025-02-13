<template>
  <div id="app" class="app-layout">
    <MenuModal />

    <div class="content">
      <!-- Aqui será renderizado o componente baseado na rota atual -->
      <router-view />
    </div>

    <RodapePedido />
  </div>
</template>

<script>
import MenuModal from './components/MenuModal.vue';
import RodapePedido from './components/RodapePedido.vue';

export default {
  name: 'App',
  components: {
    MenuModal,
    RodapePedido,
  },
};
</script>

<style>
body {
  display: initial;
    min-height: 100vh;
    background-color: #e3e9f7;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
}


#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Garante que ocupe toda a altura da tela */
}

.content {
  display: flex;
  flex: 1; /* Faz o conteúdo ocupar o espaço disponível */
  padding: 20px;
  margin-left: 82px; /* Espaço para o MenuModal */
  background-color: #f4f7fb;
}

main {
  flex: 1;
  padding: 20px;
  z-index: 1;
}

footer {
  background-color: #412884;
  color: white;
  text-align: center;
  padding: 10px 0;
}
</style>
