import axios from "axios";

export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    async fetchItems() {
      try {
        const response = await axios.get("http://localhost:3001/items");
        this.items = response.data;
      } catch (error) {
        console.error("Error al cargar items:", error.message);
      }
    }
  },
  mounted() {
    this.fetchItems();
  }
};
