
import axios from "axios";

export default {
  data() {
    return {
      filters: {
        startDate: "",
        endDate: "",
        package: "",
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
      const { startDate, endDate, package: selectedPackage } = this.filters;

      if (!startDate || !endDate || !selectedPackage) {
        alert("Por favor, completa todos los campos antes de generar el reporte.");
        return;
      }

      try {
        
        const report = {
          startDate: startDate,
          endDate: endDate,
          bundleId: selectedPackage.bundleId,
      };

        const response = await axios.post('http://localhost:3001/appointment/report', report);

     

        this.datos = response.data.map(appointment => ({
          appointmentId: appointment.appointmentId,
          date: appointment.date,
          place: appointment.place,
          description: appointment.description,
          bundleName: appointment.bundleName,
          contractId: appointment.contractId,
          contractStatus: appointment.contractStatus,
        }));
        this.dataAvailable = true;

        console.log("Generando reporte con los filtros:", this.filters);
      } catch (error) {
        console.error("Error al generar el reporte:", error.message);
        alert("Error al generar el reporte. Por favor, intenta nuevamente.");
      }
    },
    exportData() {
      if (!this.dataAvailable) {
        alert("No hay datos para exportar.");
        return;
      }
      console.log("Exportando datos:", this.datos);
      // Aquí puedes agregar la lógica para exportar los datos, por ejemplo, a un archivo CSV o PDF
    },
  },
};