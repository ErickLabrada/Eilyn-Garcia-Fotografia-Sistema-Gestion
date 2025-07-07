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
            <span :class="getStatusClass(cita.contract?.status?.status)">
  {{ cita.contract?.status?.status || 'Sin estatus' }}
</span>
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
  if (!cita?.contract?.status?.status) {
    alert("Esta cita no tiene un estatus definido.");
    return;
  }

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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fb;
  padding: 2rem;
  color: #2c3e50;
}

.admin-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ccc;
  padding-bottom: 0.5rem;
}

h4 {
  font-weight: 400;
  color: #666;
  margin-bottom: 2rem;
}

.appointment-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.appointment-table th,
.appointment-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.appointment-table th {
  background-color: #e9edf5;
  color: #333;
  text-transform: capitalize;
  font-size: 0.95rem;
}

.appointment-table td {
  font-size: 0.95rem;
  color: #444;
}

.appointment-table tr:hover {
  background-color: #f5f7fa;
}

.options {
  display: flex;
  gap: 0.5rem;
}

/* Botones de acción */
.action-btn {
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.action-btn.confirm {
  background-color: #e0f7f4;
  color: #00796b;
}

.action-btn.confirm:hover {
  background-color: #c2ede8;
}

.action-btn.cancel {
  background-color: #fff1f0;
  color: #d32f2f;
}

.action-btn.cancel:hover {
  background-color: #f9d5d3;
}

.action-btn.delete {
  background-color: #fbe9e7;
  color: #c62828;
}

.action-btn.delete:hover {
  background-color: #f2c7c3;
}

/* Estilos para estatus */
.text-success {
  color: #388e3c;
  font-weight: 500;
}

.text-warning {
  color: #f9a825;
  font-weight: 500;
}

.text-danger {
  color: #d32f2f;
  font-weight: 500;
}

.text-muted {
  color: #999;
}

/* Modal */
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
}

.modal-content h3 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: #333;
}

.modal-content label {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #555;
}

.modal-content input {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn,
.cancel-btn {
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn {
  background-color: #2b6cb0;
  color: #fff;
}

.submit-btn:hover {
  background-color: #1a4f8b;
}

.cancel-btn {
  background-color: #ccc;
  color: #333;
}

.cancel-btn:hover {
  background-color: #bbb;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }

  .appointment-table {
    font-size: 0.85rem;
  }

  .modal-content {
    padding: 1.5rem;
  }
}
</style>