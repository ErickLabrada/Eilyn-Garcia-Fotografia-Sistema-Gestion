<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Sistema de fotografía</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item dropdown" v-for="menu in menus" :key="menu.title">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ menu.title }}
            </a>
            <ul class="dropdown-menu">
              <li
                v-for="subItem in menu.items"
                :key="subItem"
                @click="navigate(subItem)"
              >
                <a class="dropdown-item" href="#">{{ subItem }}</a>
              </li>
            </ul>
          </li>
        </ul>

        <span class="navbar-text me-3">Usuario: (Nombre de usuario)</span>

        <button class="btn btn-outline-danger" @click="logout">
          Cerrar sesión
        </button>
      </div>
    </div>
  </nav>

  <div class="actions-container">
    <button class="btn-action schedule-btn" @click="agendarCita">Agendar cita</button>
    <button class="btn-action report-btn" @click="generarReportePDF">Generar Reporte PDF</button>
  </div>

  <h2>Administrar Citas</h2>
  <table class="appointment-table">
    <thead>
      <tr>
        <th>Nombre del Cliente</th>
        <th>Lugar</th>
        <th>Paquete</th>
        <th>Fecha y Hora</th>
        <th>Estatus</th>
        <th>Opciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(cita, index) in citas" :key="index">
        <td>{{ cita.contract.client.name }}</td>
        <td>{{ cita.place }}</td>
        <td>{{ cita.bundle.name }}</td>
        <td>{{ cita.date }}</td>
        <td>
          <span :class="getStatusClass(cita.contract.status.status)">{{ cita.contract.status.status }}</span>
        </td>
        <td class="options">
          <button @click="confirmarCita(cita.id)">✔</button>
          <button @click="abrirModal(cita)">✎</button>
          <button @click="eliminarCita(cita.id)">🗑</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Modal para editar los datos -->
  <div v-if="mostrarModal" class="modal">
    <div class="modal-content">
      <h3>Editar datos del cliente</h3>
      <label>
        Nombre:
        <input v-model="citaSeleccionada.contract.client.name" />
      </label>
      <label>
        Lugar:
        <input v-model="citaSeleccionada.place" />
      </label>
      <label>
        Paquete:
        <input v-model="citaSeleccionada.bundle.name" />
      </label>
      <label>
        Fecha y hora:
        <input type="datetime-local" v-model="citaSeleccionada.date" />
      </label>
      <div class="modal-actions">
        <button @click="guardarCambios">Guardar</button>
        <button @click="cerrarModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { citaService } from "../logic/cita.js";

export default {
  data() {
    return {
      citas: [],
      mostrarModal: false,
      citaSeleccionada: {},
      menus: [],
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
    confirmarCita(id) {
      citaService.confirmarCita(id).then(this.fetchCitas);
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
    // Método para generar el reporte
    async generarReportePDF() {
      try {
        await citaService.generarReportePDF(this.citas);
      } catch (error) {
        console.error("Error al generar el reporte PDF:", error);
      }
    },
    // Manejo de la navegación por el menú
    navigate(subItem) {
      console.log("Navegando a:", subItem);
      // Aquí puedes agregar la lógica para navegar a las distintas vistas de la página
    },
    logout() {
      // Implementar lógica para cerrar sesión
      console.log("Cerrar sesión");
    },
  },
  async created() {
    this.menus = citaService.getMenuOptions();
    await this.fetchCitas();
  },
};
</script>

<style scoped>
.text-success {
  color: green;
}
.text-warning {
  color: orange;
}
.text-danger {
  color: red;
}
.text-muted {
  color: gray;
}
</style>
