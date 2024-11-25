import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data() {
    return {
      menus: [
        {
          title: "Administrar",
          items: [
            "Administrar citas",
            "Administrar empleados",
            "Administrar promociones",
            "Administrar paquetes",
          ],
          isOpen: false,
        },
        {
          title: "Consultas",
          items: [
            "Consultar cliente",
            "Consultar paquete con permiso de publicación",
          ],
          isOpen: false,
        },
        {
          title: "Reportes",
          items: [
            "Reporte de ventas"
            
          ],
          isOpen: false,
        },
      ],
      citas: [
        {
          cliente: "Nombre 1",
          lugar: "Villa Itson",
          paquete: 1,
          fecha: "2024-09-12T12:00",
          estatus: "Por Confirmar",
        },
        {
          cliente: "Nombre 2",
          lugar: "Casa Blanca",
          paquete: 3,
          fecha: "2024-09-10T12:00",
          estatus: "Cita Confirmada",
        },
        {
          cliente: "Nombre 3",
          lugar: "Villa Itson",
          paquete: 1,
          fecha: "2024-09-12T12:00",
          estatus: "Por Confirmar",
        },
        {
          cliente: "Nombre 4",
          lugar: "Casa Blanca",
          paquete: 3,
          fecha: "2024-09-10T12:00",
          estatus: "Cita Confirmada",
        },
      ],
      mostrarModal: false,
      citaSeleccionada: null,
    };
  },
  methods: {
    toggleDropdown(title) {
      this.menus = this.menus.map((menu) =>
        menu.title === title
          ? { ...menu, isOpen: !menu.isOpen }
          : { ...menu, isOpen: false }
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
    getStatusClass(estatus) {
      return {
        "status-confirmed": estatus === "Cita Confirmada",
        "status-pending": estatus === "Por Confirmar",
        "status-upcoming": estatus === "Cita Próxima",
      };
    },
    confirmarCita(cita) {
      cita.estatus = "Cita Confirmada";
    },
    cancelarCita(cita) {
      cita.estatus = "Por Confirmar";
    },
    eliminarCita(cita) {
      this.citas = this.citas.filter((c) => c !== cita);
    },
    abrirModal(cita) {
      this.citaSeleccionada = { ...cita };
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.citaSeleccionada = null;
    },
    guardarCambios() {
      const index = this.citas.findIndex(
        (c) => c.cliente === this.citaSeleccionada.cliente
      );
      if (index !== -1) {
        this.citas.splice(index, 1, { ...this.citaSeleccionada });
      }
      this.cerrarModal();
    },
    generarReportePDF() {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Citas", 10, 10);
      const encabezados = [
        "Nombre del Cliente",
        "Lugar",
        "Paquete",
        "Fecha y Hora",
        "Estatus",
      ];
      const filas = this.citas.map((cita) => [
        cita.cliente,
        cita.lugar,
        cita.paquete,
        cita.fecha,
        cita.estatus,
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
      doc.save("reporte_citas.pdf");
    },
  },
};