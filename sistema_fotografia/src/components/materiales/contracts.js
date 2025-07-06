import axios from "axios";

export default {
  data() {
    return {
      clients: []
    };
  },
  methods: {
    async fetchClient() {
      try {
        const response = await axios.get("http://localhost:3001/contracts");
        this.clients = response.data;
      } catch (error) {
        console.error("Error al cargar los contratos:", error.message);
      }
    }
  },
  mounted() {
    this.fetchClient();
  }
};
