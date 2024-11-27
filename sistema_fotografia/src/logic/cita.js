import axios from "axios";

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

  // Confirmar una cita por su ID
  async confirmarCita(id) {
    try {
      await apiClient.patch(`/${id}`, { status: "Cita Confirmada" });
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
      await apiClient.patch(`/${id}`, data);
    } catch (error) {
      console.error("Error al actualizar cita:", error.message);
      throw error;
    }
  },
};
