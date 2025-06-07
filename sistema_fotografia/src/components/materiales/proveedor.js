import axios from "axios";

export default {
  data() {
    return {
      proveedores: []
    };
  },
  methods: {
    async fetchProveedor() {
      try {
        const response = await axios.get("http://localhost:3001/providers");
        this.proveedores = response.data;
      } catch (error) {
        console.error("Error al cargar proveedores:", error.message);
      }
    }
  },
  mounted() {
    this.fetchProveedor();
  }
};
