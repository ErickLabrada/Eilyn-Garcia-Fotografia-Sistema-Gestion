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

  <h2>Administrar citas</h2>
  <table class="appointment-table">
    <thead>
      <tr>
        <th>Nombre del Cliente</th>
        <th>Lugar</th>
        <th>Paquete</th>
        <th>Fecha y hora de cita</th>
        <th>Estatus</th>
        <th>Opciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(cita, index) in citas" :key="index">
        <td>{{ cita.cliente }}</td>
        <td>{{ cita.lugar }}</td>
        <td>{{ cita.paquete }}</td>
        <td>{{ cita.fecha }}</td>
        <td>
          <span :class="getStatusClass(cita.estatus)">{{ cita.estatus }}</span>
        </td>
        <td class="options">
          <button @click="confirmarCita(cita)">✔</button>
          <button @click="abrirModal(cita)">✎</button>
          <button @click="cancelarCita(cita)">✖</button>
          <button @click="eliminarCita(cita)">🗑</button>
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
        <input v-model="citaSeleccionada.cliente" />
      </label>
      <label>
        Lugar:
        <input v-model="citaSeleccionada.lugar" />
      </label>
      <label>
        Paquete:
        <input type="number" v-model="citaSeleccionada.paquete" />
      </label>
      <label>
        Fecha y hora:
        <input type="datetime-local" v-model="citaSeleccionada.fecha" />
      </label>
      <div class="modal-actions">
        <button @click="guardarCambios">Guardar</button>
        <button @click="cerrarModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import logica3 from "../logic/cita.js";

export default {
  mixins: [logica3],
  methods: {
    agendarCita() {
      // Lógica para abrir un modal o redirigir a la página de agendar cita
      alert("Agendar cita no implementado");
    },
  },
};
</script>

<style scoped>

</style>
