// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CreditoTaxa from '../components/CreditoTaxa.vue';
import PlanilhaClientes from '../components/PlanilhaClientes.vue';
import loginUser from '../components/loginUser.vue';
import ImportCsv from '../components/ImportCsv.vue';
import MovementsView from '../components/MovementsView.vue';
import MovementsModal from '../components/MovementsModal.vue';

// Defina suas rotas
const routes = [
  { path: '/', component: PlanilhaClientes },
  { path: '/credito', component: CreditoTaxa },
  { path: '/login', component: loginUser },
  { path: '/import-csv', component: ImportCsv },
  { path: '/movements', component: MovementsView },
  { path: '/movementsModal', component: MovementsModal},
];

// Crie e configure o Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
