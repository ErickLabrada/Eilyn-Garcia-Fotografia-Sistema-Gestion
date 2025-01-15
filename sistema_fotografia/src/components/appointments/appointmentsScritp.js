import { citaService } from "./cita.js";
import Navbar from '../../components/HeaderComponent.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      menus: [],
      citas: [],
      mostrarModal: false,
      citaSeleccionada: {},
    };
  },
  methods: {
    async fetchCitas() {
      try {
        this.citas = await citaService.getCitas();
      } catch (error) {
        console.error("Error al cargar citas:", error);
      }
    },
    getStatusClass(status) {
      const classes = {
        "Aceptada": "text-success",
        "Pendiente": "text-warning",
        "Rechazada": "text-danger",
      };
      return classes[status] || "text-muted";
    },
    confirmarCita(cita) {
      if (cita.contract.status.status === "Aceptada") {
        alert("La cita ya está confirmada.");
        return;
      }
      citaService.confirmarCita(cita.id).then(this.fetchCitas);
    },
    cancelarCita(cita) {
      if (cita.contract.status.status === "Rechazada") {
        alert("La cita ya está rechazada.");
        return;
      }
      citaService.cancelarCita(cita.id).then(this.fetchCitas);
    },
    eliminarCita(id) {
      citaService.eliminarCita(id).then(this.fetchCitas);
    },
    abrirModal(cita) {
      this.citaSeleccionada = { ...cita };
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    guardarCambios() {
      citaService.actualizarCita(this.citaSeleccionada.id, this.citaSeleccionada)
        .then(() => {
          this.mostrarModal = false;
          this.fetchCitas();
        });
    },
    async generarReportePDF() {
      try {
        await citaService.generarReportePDF(this.citas);
      } catch (error) {
        console.error("Error al generar el reporte PDF:", error);
      }
    },
    navigate(subItem) {
      console.log("Navegando a:", subItem);
    },
    logout() {
      console.log("Cerrar sesión");
    },
  },
  async created() {
    this.menus = citaService.getMenuOptions();
    await this.fetchCitas();
  },
};
