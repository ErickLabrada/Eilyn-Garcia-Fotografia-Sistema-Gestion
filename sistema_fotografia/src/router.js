import { createRouter, createWebHistory } from 'vue-router';
import InicioSesionView from './components/inicioSesion/InicioSesionView.vue'; 
import InicioView from './components/paginaInicio/InicioView.vue';
import PaquetesView from './components/paquetes/PaquetesView.vue';
import AdministrarCitaView from './components/administrarCita/AdministrarCitaView.vue';
import ReporteVentasView from './components/reportes/ReporteVentasView.vue';
import EmpleadosView from './components/empleados/EmpleadosView.vue';
import RecordatorioView from './components/recordatorio/RecordatorioView.vue';
import AgendarEntregaView from './components/agendarEntrega/AgendarEntregaView.vue';
import PromocionesView from './components/promociones/PromocionesView.vue';
import SolicitarMaterialView from './components/materiales/SolicitarMaterialView.vue';
const routes = [
  {
    path: '/',             
    redirect: '/inicioSesion',    
  },
  {
    path: '/inicioSesion', 
    name: 'InicioSesion',
    component: InicioSesionView,
  },
  {
    path: '/inicio', 
    name: 'Inicio', 
    component: InicioView,
  },
  {
    path: "/paquetes",
    name: "Paquetes",
    component: PaquetesView,
  },
  {
    path: "/administrarCitas",
    name: "AdministrarCitas",
    component: AdministrarCitaView,
  },
  {
    path: "/reporteVentas",
    name: "ReporteVentas",
    component: ReporteVentasView,
  },
  {
    path: "/empleados",
    name: "Empleados",
    component: EmpleadosView,
  },
  {
    path: "/recordatorio",
    name: "Recordatorio",
    component: RecordatorioView,
  },
  {
    path: "/promociones",
    name: "Promociones",
    component: PromocionesView,
  },
  {
    path: "/entregas",
    name: "Entregas",
    component: AgendarEntregaView,
  },
  {
    path: "/materiales",
    name: "Materiales",
    component: SolicitarMaterialView,
  }
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

export default router;
