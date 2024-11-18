<template>
  <div id="navbar">
    <div class="navbar-header">
      <span>Usuario: (Nombre de usuario)</span>
      <button @click="logout">Cerrar sesión</button>
    </div>
    <div class="navbar-menu">
      <div class="menu-item" v-for="menu in menus" :key="menu.title">
        <span @click="toggleDropdown(menu.title)">{{ menu.title }}</span>
        <ul v-if="menu.isOpen" class="dropdown">
          <li v-for="subItem in menu.items" :key="subItem" @click="navigate(subItem)">
            {{ subItem }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div>
    <h2>Administrar citas</h2>
    <button class="schedule-btn">Agendar cita</button>
    <button class="report-btn" @click="generarReportePDF">Generar Reporte PDF</button>
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
  </div>
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
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data() {
    return {
      menus: [
        {
          title: "Administrar",
          items: [
            "Administrar citas",
            "Administrar empleados",
            "Administrar promociones",
            "Administrar paquetes",
          ],
          isOpen: false,
        },
        {
          title: "Consultas",
          items: [
            "Consultar cliente",
            "Consultar paquete con permiso de publicación",
          ],
          isOpen: false,
        },
        {
          title: "Reportes",
          items: [
            "Reporte de ventas por paquete",
            "Reporte de ventas por evento",
          ],
          isOpen: false,
        },
      ],
      citas: [
        {
          cliente: "Nombre 1",
          lugar: "Villa Itson",
          paquete: 1,
          fecha: "2024-09-12T12:00",
          estatus: "Por Confirmar",
        },
        {
          cliente: "Nombre 2",
          lugar: "Casa Blanca",
          paquete: 3,
          fecha: "2024-09-10T12:00",
          estatus: "Cita Confirmada",
        },
        {
          cliente: "Nombre 3",
          lugar: "Villa Itson",
          paquete: 1,
          fecha: "2024-09-12T12:00",
          estatus: "Por Confirmar",
        },
        {
          cliente: "Nombre 4",
          lugar: "Casa Blanca",
          paquete: 3,
          fecha: "2024-09-10T12:00",
          estatus: "Cita Confirmada",
        },
      ],
      mostrarModal: false,
      citaSeleccionada: null,
    };
  },
  methods: {
    toggleDropdown(title) {
      this.menus = this.menus.map((menu) =>
        menu.title === title
          ? { ...menu, isOpen: !menu.isOpen }
          : { ...menu, isOpen: false }
      );
    },
    logout() {
      console.log("Cerrando sesión...");
    },
    navigate(subItem) {
      if (subItem === "Administrar citas") {
        this.$router.push("/citas"); 
      } else if (subItem === "Administrar paquetes") {
        this.$router.push("/paquetes"); 
      } else {
        console.log(`Navegando a: ${subItem}`);
      }
    },
    getStatusClass(estatus) {
      return {
        "status-confirmed": estatus === "Cita Confirmada",
        "status-pending": estatus === "Por Confirmar",
        "status-upcoming": estatus === "Cita Próxima",
      };
    },
    confirmarCita(cita) {
      cita.estatus = "Cita Confirmada";
    },
    cancelarCita(cita) {
      cita.estatus = "Por Confirmar";
    },
    eliminarCita(cita) {
      this.citas = this.citas.filter((c) => c !== cita);
    },
    abrirModal(cita) {
      this.citaSeleccionada = { ...cita };
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.citaSeleccionada = null;
    },
    guardarCambios() {
      const index = this.citas.findIndex(
        (c) => c.cliente === this.citaSeleccionada.cliente
      );
      if (index !== -1) {
        this.citas.splice(index, 1, { ...this.citaSeleccionada });
      }
      this.cerrarModal();
    },
    generarReportePDF() {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Citas", 10, 10);
      const encabezados = [
        "Nombre del Cliente",
        "Lugar",
        "Paquete",
        "Fecha y Hora",
        "Estatus",
      ];
      const filas = this.citas.map((cita) => [
        cita.cliente,
        cita.lugar,
        cita.paquete,
        cita.fecha,
        cita.estatus,
      ]);
      if (doc.autoTable) {
        doc.autoTable({
          head: [encabezados],
          body: filas,
          startY: 20,
        });
      } else {
        let y = 20;
        filas.forEach((fila, index) => {
          doc.text(`${index + 1}. ${fila.join(" | ")}`, 10, y);
          y += 10;
        });
      }
      doc.save("reporte_citas.pdf");
    },
  },
};
</script>


  
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: rgb(255, 255, 255);
}
#navbar {
  display: flex;
  flex-direction: column;
  background-color: #333;
  color: rgb(255, 255, 255);
  padding: 10px;
}
.navbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.navbar-header button {
  background-color: #444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.navbar-header button:hover {
  background-color: #555;
}
.navbar-menu {
  display: flex;
  justify-content: space-between;
}
.menu-item {
  position: relative;
  margin-right: 20px;
  cursor: pointer;
}
.menu-item span {
  font-weight: bold;
}
.dropdown {
  position: absolute;
  top: 20px;
  left: 0;
  background-color: #444;
  list-style: none;
  margin: 0;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
.dropdown li {
  margin: 5px 0;
  cursor: pointer;
}
.dropdown li:hover {
  color: #ddd;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.schedule-btn {
  background-color: #555;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-bottom: 15px;
  cursor: pointer;
  border-radius: 5px;
}
.schedule-btn:hover {
  background-color: #777;
}
.appointment-table {
  width: 100%;
  border-collapse: collapse;
  margin: auto;
}
.appointment-table th, .appointment-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
.status-confirmed {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}
.status-pending {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}
.status-upcoming {
  background-color: orange;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}
.options button {
  margin: 0 5px;
  border: none;
  background: none;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}
.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.modal-actions button {
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.modal-actions button:hover {
  background-color: #ddd;
}
.report-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  margin: 10px 0;
}
.report-btn:hover {
  background-color: #0056b3;
}

</style>
