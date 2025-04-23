import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/UserLogin.vue'; 
import PaginaInicial from './components/PaginaInicial.vue';
import PaginaPaquetes from './components/PaginaPaquetes.vue';
import ConfirmarCita from './components/AdministrarCita.vue';
import ReporteVentas from './components/ReporteVentas.vue';
import EmpleadosView from './components/EmpleadosView.vue';
const routes = [
  {
    path: '/login', 
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
  },
  {
    path: "/citas",
    name: "Citas",
    component: ConfirmarCita,
  },
  {
    path: "/reporte",
    name: "Reporte",
    component: ReporteVentas,
  },
  {
    path: "/empleados",
    name: "Empleados",
    component: EmpleadosView,
  }

];

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

export default router;
