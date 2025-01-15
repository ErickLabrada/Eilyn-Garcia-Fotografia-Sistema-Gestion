import axios from "axios";

export default {
  data() {
    return {
      paquetes: [],
      eventos: [],
      modalVisible: false,
      modalEditarVisible: false,
      modalNuevoVisible: false,
      paqueteSeleccionado: null,
      nuevoPaquete: {
        name: "",
        price: "",
        imagen: "",
        eventId: null,
        contractsId: [],
        itemsID: [],
        appointmentTemplateID: null,
      },
      paqueteEditar: {
        id: null,
        name: "",
        price: "",
        imagen: "",
        eventId: null,
        contractsId: [],
        itemsID: [],
        appointmentTemplateID: null,
      },
      errorCosto: "",
    };
  },
  created() {
    this.fetchPaquetes();
    this.fetchEventos();
  },
  methods: {
    async fetchPaquetes() {
      try {
        const response = await axios.get("http://localhost:3001/bundle");
        this.paquetes = response.data;
      } catch (error) {
        console.error("Error al obtener paquetes:", error.message);
      }
    },
    async fetchEventos() {
      try {
        const response = await axios.get("http://localhost:3001/events");
        this.eventos = response.data;
      } catch (error) {
        console.error("Error al obtener eventos:", error.message);
      }
    },
    abrirModal(paquete) {
      this.paqueteSeleccionado = { ...paquete };
      this.modalVisible = true;
    },
    cerrarModal() {
      this.modalVisible = false;
      this.paqueteSeleccionado = null;
    },
    abrirEditarPaquete(paquete) {
      this.paqueteEditar = { ...paquete };
      this.modalEditarVisible = true;
    },
    cerrarEditarModal() {
      this.modalEditarVisible = false;
      this.paqueteEditar = {
        id: null,
        name: "",
        price: "",
        imagen: "",
        eventId: null,
        contractsId: [],
        itemsID: [],
        appointmentTemplateID: null,
      };
    },
    async guardarCambios() {
      if (!this.validarCosto(this.paqueteEditar.price)) {
        this.errorCosto = "El costo debe ser un número positivo sin letras.";
        return;
      } else {
        this.errorCosto = "";
      }

      if (this.paqueteEditar.name && this.paqueteEditar.price) {
        try {
          await axios.patch(`http://localhost:3001/bundle/${this.paqueteEditar.id}`, {
            name: this.paqueteEditar.name,
            price: this.paqueteEditar.price,
            url: this.paqueteEditar.imagen
          });

          this.fetchPaquetes();
          this.cerrarEditarModal();
        } catch (error) {
          console.error("Error al editar el paquete:", error.message);
        }
      } else {
        alert("Por favor, llena todos los campos obligatorios.");
      }
    },
    cargarImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.paqueteEditar.imagen = file.name; // Solo guardamos el nombre del archivo
      }
    },
    eliminarPaquete(paquete) {
      const index = this.paquetes.findIndex(p => p.name === paquete.name);
      if (index !== -1) {
        this.paquetes.splice(index, 1);
      }
    },
    toggleEstadoPaquete(paquete) {
      paquete.activo = !paquete.activo;
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
        contractsId: [],
        itemsID: [],
        appointmentTemplateID: null,
      };
    },
    async agregarPaquete() {
      if (!this.validarCosto(this.nuevoPaquete.price)) {
        this.errorCosto = "El costo debe ser un número positivo sin letras.";
        return;
      } else {
        this.errorCosto = "";
      }

      if (this.nuevoPaquete.name && this.nuevoPaquete.price) {
        try {
          await axios.post("http://localhost:3001/bundle", {
            name: this.nuevoPaquete.name,
            price: this.nuevoPaquete.price,
            url: this.nuevoPaquete.imagen,
            eventsID: [this.nuevoPaquete.eventId],
            contractsId: this.nuevoPaquete.contractsId,
            itemsID: this.nuevoPaquete.itemsID,
            appointmentTemplateID: this.nuevoPaquete.appointmentTemplateID,
          });
          
          this.cerrarModalNuevo();
          this.fetchPaquetes();
        } catch (error) {
          console.error("Error al guardar el paquete:", error.message);
        }
      } else {
        alert("Por favor, llena todos los campos obligatorios.");
      }
    },
    cargarNuevaImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.nuevoPaquete.imagen = file.name; // Solo guardamos el nombre del archivo
      }
    },
    validarCosto(price) {
      const priceNumerico = parseFloat(price);
      // Verificar si el costo no es un número válido, es negativo o contiene letras
      if (isNaN(priceNumerico) || priceNumerico <= 0 || /[a-zA-Z]/.test(price)) {
        return false;
      }
      return true;
    },
    generarReportePaquetesPDF() {
      // Lógica para generar el reporte PDF de los paquetes
    },
  },
};