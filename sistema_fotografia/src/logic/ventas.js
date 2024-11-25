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
          },
          {
            title: "Consultas",
            items: [
              "Consultar cliente",
              "Consultar paquete con permiso de publicación",
            ],
          },
          {
            title: "Reportes",
            items: ["Reporte de ventas por paquete"],
          },
        ],
        activeMenu: null,
        activeSubItem: null,
        filters: {
          startDate: "",
          endDate: "",
          package: "",
        },
        datos: [],
        dataAvailable: false,
      };
    },
    methods: {
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
      generateReport() {
        const { startDate, endDate, package: selectedPackage } = this.filters;
        if (!startDate || !endDate || !selectedPackage) {
          alert("Por favor, completa todos los campos antes de generar el reporte.");
          return;
        }
  
       
        this.datos = [
          `Reporte del paquete ${selectedPackage}`,
          `Desde: ${startDate}`,
          `Hasta: ${endDate}`,
        ];
        this.dataAvailable = true;
  
        console.log("Generando reporte con los filtros:", this.filters);
      },
      exportData() {
        if (!this.dataAvailable) {
          alert("No hay datos para exportar.");
          return;
        }
        console.log("Exportando datos:", this.datos);
        
      },
    },
  };