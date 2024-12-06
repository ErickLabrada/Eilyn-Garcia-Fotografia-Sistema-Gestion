<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Sistema de fotografía</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item dropdown" v-for="menu in menus" :key="menu.title">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ menu.title }}
            </a>
            <ul class="dropdown-menu">
              <li
                v-for="subItem in menu.items"
                :key="subItem"
                @click="navigate(subItem)"
              >
                <a class="dropdown-item" href="#">{{ subItem }}</a>
              </li>
            </ul>
          </li>
        </ul>

        

        
        
      </div>
    </div>
  </nav>
</template>

<script>
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
</script>

<style scoped>
@import '../assets/styles.css';
</style>
