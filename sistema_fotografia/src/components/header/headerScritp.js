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
            items: ["Reporte de ventas"],
          },
        ],
      };
    },
    methods: {
      navigate(subItem) {
        if (subItem === "Administrar citas") {
          this.$router.push("/citas");
        } else if (subItem === "Administrar paquetes") {
          this.$router.push("/paquetes");
        } else if (subItem === "Reporte de ventas") {
          this.$router.push("/reporte");
        } else {
          console.log(`Opción no configurada: ${subItem}`);
        }
      },
      logout() {
        console.log("Cerrando sesión...");
      },
    },
  };