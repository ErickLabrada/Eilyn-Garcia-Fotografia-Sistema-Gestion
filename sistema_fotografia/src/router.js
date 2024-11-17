import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/UserLogin.vue'; 
import PaginaInicial from './components/PaginaInicial.vue';

const routes = [
  {
    path: '/', 
    name: 'Login',
    component: Login,
  },
  {
    path: '/paginaInicial', 
    name: 'PaginaInicial', 
    component: PaginaInicial,
  }
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

export default router;
