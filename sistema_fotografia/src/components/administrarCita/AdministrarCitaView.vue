<template>
  <Navbar :menus="menus" />
  <div class="admin-container">
    <h2 class="admin-title">Administrar Citas</h2>
  <h4>Aqui se mostraran las citas agendadas.</h4>
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
            <button @click="confirmarCita(cita)" class="action-btn confirm">✔</button>
            <button @click="cancelarCita(cita)" class="action-btn cancel">X</button>
            <button @click="eliminarCita(cita.id)" class="action-btn delete">🗑</button>
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
          <button @click="guardarCambios" class="submit-btn">Guardar</button>
          <button @click="cerrarModal" class="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { citaService } from "../../logic/cita.js";
import Navbar from '../../components/navbar/NavegacionView.vue';

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
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 2rem;
}

.admin-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.75rem;
}

.btn-action {
  padding: 0.75rem;
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.btn-action:hover {
  background-color: #2c5282;
}

.appointment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.appointment-table th,
.appointment-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.appointment-table th {
  background-color: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.appointment-table tr:hover {
  background-color: #f8fafc;
}

.options {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.confirm {
  background-color: #e6fffa;
  color: #38b2ac;
}

.action-btn.confirm:hover {
  background-color: #b2f5ea;
}

.action-btn.cancel {
  background-color: #fff5f5;
  color: #f56565;
}

.action-btn.cancel:hover {
  background-color: #fed7d7;
}

.action-btn.delete {
  background-color: #fbdada;
  color: #e53e3e;
}

.action-btn.delete:hover {
  background-color: #fbd5d5;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.submit-btn, .cancel-btn {
  padding: 0.75rem;
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-btn:hover, .cancel-btn:hover {
  background-color: #2c5282;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }
  
  .appointment-table {
    font-size: 0.875rem;
  }
}
</style>
