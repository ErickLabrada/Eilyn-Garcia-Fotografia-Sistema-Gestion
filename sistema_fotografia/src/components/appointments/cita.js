import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Configuración del cliente Axios
const apiClient = axios.create({
  baseURL: "http://localhost:3001/appointment", // URL del backend
  headers: {
    "Content-Type": "application/json",
  },
});

export const citaService = {
  // Obtener todas las citas desde el backend
  async getCitas() {
    try {
      const response = await apiClient.get("/");
      return response.data; // Retorna las citas obtenidas
    } catch (error) {
      console.error("Error al obtener citas:", error.message);
      throw error;
    }
  },

  // Obtener el appointment por su ID
  async getAppointmentById(appointmentId) {
    try {
      const response = await apiClient.get(`/${appointmentId}`);
      return response.data; // Retorna el appointment
    } catch (error) {
      console.error("Error al obtener appointment:", error.message);
      throw error;
    }
  },

 
  async cancelarCita(id) {
    try {
      const response = await apiClient.patch(`/cancel/${id}`);
      return response.data; // Retorna el appointment confirmado
    } catch (error) {
      console.error("Error al rechazar cita:", error.message);
      throw error;
    }
  },
 // Confirmar una cita por su ID
  async confirmarCita(id) {
    try {
      const response = await apiClient.patch(`/confirm/${id}`);
      return response.data; // Retorna el appointment confirmado
    } catch (error) {
      console.error("Error al confirmar cita:", error.message);
      throw error;
    }
  },

  // Eliminar una cita por su ID
  async eliminarCita(id) {
    try {
      await apiClient.delete(`/${id}`);
    } catch (error) {
      console.error("Error al eliminar cita:", error.message);
      throw error;
    }
  },

  // Actualizar una cita por su ID
  async actualizarCita(id, data) {
    try {
      await apiClient.patch(`/${id}`, {
        contract: {
          client: { name: data.contract.client.name },
        },
        place: data.place,
        bundle: { name: data.bundle.name },
        date: data.date,
      });
    } catch (error) {
      console.error("Error al actualizar cita:", error.message);
      throw error;
    }
  },

  generarReportePDF(citas) {
    try {
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

      const filas = citas.map((cita) => [
        cita.contract.client.name,
        cita.place,
        cita.bundle.name,
        cita.date,
        cita.contract.status.status,
      ]);

      if (doc.autoTable) {
        doc.autoTable({
          head: [encabezados],
          body: filas,
          startY: 20,
        });
      }

      doc.save("reporte_citas.pdf");
    } catch (error) {
      console.error("Error al generar PDF:", error.message);
      throw error;
    }
  },

  // Opciones del menú
  getMenuOptions() {
    return [
      {
        title: "Administrar",
        items: [
          "Administrar citas",
          "Administrar empleados",
          "Administrar promociones",
          "Administrar paquetes",
        ],
      },
      {
        title: "Consultas",
        items: [
          "Consultar cliente",
          "Consultar paquete con permiso de publicación",
        ],
      },
      {
        title: "Reportes",
        items: ["Reporte de ventas"],
      },
    ];
  },
};