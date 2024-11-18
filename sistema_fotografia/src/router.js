import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/UserLogin.vue'; 
import PaginaInicial from './components/PaginaInicial.vue';
import PaginaPaquetes from './components/PaginaPaquetes.vue';
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
  },
  {
    path: "/paquetes",
    name: "Paquetes",
    component: PaginaPaquetes,
  }
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

export default router;
