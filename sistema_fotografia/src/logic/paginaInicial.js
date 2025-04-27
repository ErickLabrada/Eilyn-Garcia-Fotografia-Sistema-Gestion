import axios from "axios";

export default {
  data() {
    return {
      loading: true,
      paquetes: [],
      eventos: [],
      promociones: [], 
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const paquetesResponse = await axios.get("http://localhost:3001/bundle");
        this.paquetes = paquetesResponse.data.map(paquete => ({
          nombre: paquete.name,
          descripcion: paquete.description || "Sin descripcion", 
          costo: `$${paquete.price}`,
        }));
        const eventosResponse = await axios.get("http://localhost:3001/events");
        this.eventos = eventosResponse.data.map(evento => ({
          id: evento.id,
          dia: evento.date || "Fecha no disponible",
          lugar: evento.place || "Lugar no disponible",
          hora: evento.time || "Hora no disponible",
        }));

        // No se ha cambiado 
        this.promociones = [
          { nombre: "Descuento del 20% en sesiones navideñas" },
          { nombre: "2x1 en sesiones de pareja" },
          { nombre: "Promoción especial para eventos empresariales" },
        ];
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
      } finally {
        this.loading = false;
      }
    },
    logout() {
      console.log("Cerrando sesión...");
    },
  },
};
