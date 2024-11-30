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
      setTimeout(() => {
        this.paquetes = [
          { nombre: "Paquete Básico", descripcion: "Sesión de 30 min.", costo: "$50" },
          { nombre: "Paquete Premium", descripcion: "Sesión de 2 horas.", costo: "$150" },
          { nombre: "Paquete Deluxe", descripcion: "Cobertura de evento completo.", costo: "$300" },
        ];
        this.eventos = [
          { id: 1, dia: "25/11/2024", lugar: "Plaza Central", hora: "10:00 AM" },
          { id: 2, dia: "30/11/2024", lugar: "Parque Norte", hora: "2:00 PM" },
          { id: 3, dia: "05/12/2024", lugar: "Estudio Fotográfico", hora: "5:00 PM" },
        ];
        this.promociones = [
          { nombre: "Descuento del 20% en sesiones navideñas" },
          { nombre: "2x1 en sesiones de pareja" },
          { nombre: "Promoción especial para eventos empresariales" },
        ];
        this.loading = false;
      }, 1500);
    },
    logout() {
      console.log("Cerrando sesión...");
    },
  },
};
