import Navbar from '../../components/HeaderComponent.vue';
import logica2 from '../../logic/paquetes.js'; 

export default {
  components: {
    Navbar, 
  },
  mixins: [logica2], 
  data() {
    return {
      paquetes: [],
      eventos: [],
      modalNuevoVisible: false,
      modalEditarVisible: false,
      nuevoPaquete: {
        name: "",
        price: "",
        imagen: "",
        eventId: null,
      },
      paqueteEditar: {
        id: null,
        name: "",
        price: "",
        imagen: "",
        eventId: null,
      },
      errorCosto: "",
    };
  },
  created() {
    this.fetchPaquetes();
    this.fetchEventos();
  },
  methods: {
    validarCosto(price) {
      const priceNumerico = parseFloat(price);
      // Verificar si el costo no es un número válido, es negativo o contiene letras
      if (isNaN(priceNumerico) || priceNumerico <= 0 || /[a-zA-Z]/.test(price)) {
        return false;
      }
      return true;
    },
    getImageUrl(url) {
      try {
        return require(`../../../base-js-baileys-memory/assets/${url}`);
      } catch (e) {
        return null;
      }
    },
    abrirModalNuevo() {
      this.modalNuevoVisible = true;
    },
    cerrarModalNuevo() {
      this.modalNuevoVisible = false;
      this.nuevoPaquete = {
        name: "",
        price: "",
        imagen: "",
        eventId: null,
      };
    },
    cargarNuevaImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.nuevoPaquete.imagen = file.name; // Solo guardamos el nombre del archivo
      }
    },
    cargarImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.paqueteEditar.imagen = file.name; // Solo guardamos el nombre del archivo
      }
    },
    abrirEditarPaquete(paquete) {
      // Copiar los datos del paquete seleccionado para edición
      this.paqueteEditar = { ...paquete };
      this.modalEditarVisible = true;
    },
    cerrarModalEditar() {
      this.modalEditarVisible = false;
      this.paqueteEditar = {
        id: null,
        name: "",
        price: "",
        imagen: "",
        eventId: null,
      };
    },
  },
};