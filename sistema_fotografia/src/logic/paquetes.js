import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data() {
    return {
      
      paquetes: [
        { nombre: "Paquete 1", descripcion: "Descripción del paquete 1", costo: "$100", promocion: "10% descuento", activo: true, imagen: null },
        { nombre: "Paquete 2", descripcion: "Descripción del paquete 2", costo: "$200", activo: false, imagen: null },
        { nombre: "Paquete 3", descripcion: "Descripción del paquete 3", costo: "$300", activo: false, imagen: null },
        { nombre: "Paquete 4", descripcion: "Descripción del paquete 4", costo: "$400", activo: false, imagen: null },
      ],
      modalVisible: false,
      modalEditarVisible: false,
      modalNuevoVisible: false,
      paqueteSeleccionado: null,
      nuevoPaquete: {
        nombre: "",
        descripcion: "",
        costo: "",
        promocion: "",
        imagen: null,
      },
    };
  },
  methods: {
    toggleDropdown(title) {
      this.menus = this.menus.map((menu) =>
        menu.title === title ? { ...menu, isOpen: !menu.isOpen } : { ...menu, isOpen: false }
      );
    },
    logout() {
      console.log("Cerrando sesión...");
    },
    navigate(subItem) {
      if (subItem === "Administrar citas") {
        this.$router.push("/citas");
      } else if (subItem === "Administrar paquetes") {
        this.$router.push("/paquetes");
      } else if(subItem === "Reporte de ventas"){
        this.$router.push("/reporte");
        console.log(`Navegando a: ${subItem}`);
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
    abrirEditarPaquete() {
      this.modalVisible = false;
      this.modalEditarVisible = true;
    },
    cerrarEditarModal() {
      this.modalEditarVisible = false;
      this.paqueteSeleccionado = null;
    },
    guardarCambios() {
      const index = this.paquetes.findIndex((p) => p.nombre === this.paqueteSeleccionado.nombre);
      if (index !== -1) {
        this.paquetes[index] = { ...this.paqueteSeleccionado };
        console.log("Paquete actualizado:", this.paqueteSeleccionado);
      }
      this.cerrarEditarModal();
    },
    cargarImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.paqueteSeleccionado.imagen = URL.createObjectURL(file);
      }
    },
    eliminarPaquete() {
      const index = this.paquetes.findIndex((p) => p.nombre === this.paqueteSeleccionado.nombre);
      if (index !== -1) {
        this.paquetes.splice(index, 1);
        console.log("Paquete eliminado");
      }
      this.cerrarModal();
    },
    toggleEstadoPaquete() {
      this.paqueteSeleccionado.activo = !this.paqueteSeleccionado.activo;
      console.log("Estado del paquete actualizado:", this.paqueteSeleccionado.activo);
    },
    abrirModalNuevo() {
      this.modalNuevoVisible = true;
    },
    cerrarModalNuevo() {
      this.modalNuevoVisible = false;
      this.nuevoPaquete = {
        nombre: "",
        descripcion: "",
        costo: "",
        promocion: "",
        imagen: null,
      };
    },
    agregarPaquete() {
      this.paquetes.push({ ...this.nuevoPaquete });
      this.cerrarModalNuevo();
    },
    cargarNuevaImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.nuevoPaquete.imagen = URL.createObjectURL(file);
      }
    },
    generarReportePaquetesPDF() {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Paquetes", 10, 10);

      
      const encabezados = ["Nombre", "Descripción", "Costo", "Promoción", "Estado"];
    
      const filas = this.paquetes.map((paquete) => [
        paquete.nombre,
        paquete.descripcion,
        paquete.costo,
        paquete.promocion || "Sin promoción",
        paquete.activo ? "Activo" : "Inactivo",
      ]);

    
      if (doc.autoTable) {
        doc.autoTable({
          head: [encabezados],
          body: filas,
          startY: 20,
        });
      } else {
       
        let y = 20;
        filas.forEach((fila, index) => {
          doc.text(`${index + 1}. ${fila.join(" | ")}`, 10, y);
          y += 10;
        });
      }

      doc.save("reporte_paquetes.pdf");
    },
  },
};