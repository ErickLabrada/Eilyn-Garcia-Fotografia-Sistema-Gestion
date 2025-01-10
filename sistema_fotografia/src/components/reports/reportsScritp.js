import Navbar from '../../components/HeaderComponent.vue';
import logica from '../../logic/ventas.js'; 
import axios from 'axios';

export default {
  components: {
    Navbar, 
  },
  mixins: [logica], 
  data() {
    return {
      bundles: [], // Aquí almacenaremos los paquetes
    };
  },
  created() {
    this.fetchBundles();
  },
  methods: {
    async fetchBundles() {
      try {
        const response = await axios.get('http://localhost:3001/bundle');
        this.bundles = response.data;
      } catch (error) {
        console.error('Error al obtener los paquetes:', error);
      }
    },
  },
};