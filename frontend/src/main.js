import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa o router

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faBell, faBox, faImage, faGear, faChartLine, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Adicionando os ícones à biblioteca globalmente
library.add(faUser, faBell, faBox, faImage, faGear, faChartLine, faRightFromBracket);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router); 
app.mount('#app');
