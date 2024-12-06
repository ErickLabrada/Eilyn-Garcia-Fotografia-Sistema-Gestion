import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  data() {
    return {
      filters: {
        startDate: "",
        endDate: "",
        bundleId: 0,
      },
      datos: [],
      dataAvailable: false,
      bundles: [], // Aquí almacenaremos los paquetes
    };
  },
  created() {
    this.fetchBundles();
  },
  methods: {
    async fetchBundles() {
      try {
        const response = await axios.get("http://localhost:3001/bundle");
        this.bundles = response.data;
      } catch (error) {
        console.error("Error al obtener los paquetes:", error);
      }
    },
    async generateReport() {
      const { startDate, endDate, bundleId } = this.filters;

      if (!startDate || !endDate || !bundleId) {
        alert("Por favor, completa todos los campos antes de generar el reporte.");
        return;
      }

      try {
        const report = {
          startDate: startDate,
          endDate: endDate,
          bundleId: bundleId,
        };

        const response = await axios.post('http://localhost:3001/appointment/report', report);

        if (response.data.length === 0) {
          alert("No hay datos para mostrar con los filtros seleccionados.");
          return;
        }

        this.datos = response.data.map(appointment => ({
          date: appointment.date,
          place: appointment.place,
          description: appointment.description,
          bundleName: appointment.bundle.name,
          contractId: appointment.contract.id,
          contractStatus: appointment.contract.status.status,
          contractCost: appointment.contract.cost,
        }));
        this.dataAvailable = true;

        console.log("Generando reporte con los filtros:", this.filters);
      } catch (error) {
        console.error("Error al generar el reporte:", error.message);
        alert("Error al generar el reporte. Por favor, intenta nuevamente.");
      }
    },
    exportData() {

      try {

        if (!this.dataAvailable) {
          alert("No hay datos para exportar.");
          return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Reporte de ventas por paquete", 10, 10);

        const encabezados = [
          "Fecha y Hora",
          "Lugar",
          "Descripción",
          "Nombre del Paquete",
          "Contrato",
          "Estado del Contrato",
          "Costo",
        ];

        const filas = this.datos.map((appointment) => [
          appointment.date,
          appointment.place,
          appointment.description,
          appointment.bundleName,
          appointment.contractId,
          appointment.contractStatus,
          appointment.contractCost,
        ]);

        if (doc.autoTable) {
          doc.autoTable({
            head: [encabezados],
            body: filas,
            startY: 20,
          });
        }

        doc.save("reporte_citas.pdf");
      } catch (error) {
        console.error("Error al generar PDF:", error.message);
        throw error;
      }
    },
  },
};