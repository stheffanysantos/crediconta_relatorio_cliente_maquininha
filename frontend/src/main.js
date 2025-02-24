import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa o router

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faBell,faHouse,faDownload, faBox, faImage, faGear, faChartLine, faRightFromBracket,faMoneyBillTransfer, faCoins, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Adicionando os ícones à biblioteca globalmente
library.add(faUsers, faBell,faHouse,faDownload, faBox, faImage, faGear, faChartLine, faRightFromBracket,faMoneyBillTransfer,faCoins,faClipboardList);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router); 
app.mount('#app');
