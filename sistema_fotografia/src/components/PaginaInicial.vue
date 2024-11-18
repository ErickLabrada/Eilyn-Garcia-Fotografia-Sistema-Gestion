<template>
  <div id="navbar">
    <div class="navbar-header">
      <span>Usuario: (Nombre de usuario)</span>
      <button @click="logout">Cerrar sesión</button>
    </div>
    <div class="navbar-menu">
      <div class="menu-item" v-for="menu in menus" :key="menu.title">
        <span @click="toggleDropdown(menu.title)">{{ menu.title }}</span>
        <ul v-if="menu.isOpen" class="dropdown">
          <li v-for="subItem in menu.items" :key="subItem" @click="navigate(subItem)">
            {{ subItem }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        {
          title: "Administrar",
          items: ["Administrar citas", "Administrar empleados", "Administrar promociones", "Administrar paquetes"],
          isOpen: false,
        },
        {
          title: "Consultas",
          items: ["Consultar cliente", "Consultar paquete con permiso de publicación"],
          isOpen: false,
        },
        {
          title: "Reportes",
          items: ["Reporte de ventas por paquete", "Reporte de ventas por evento"],
          isOpen: false,
        },
      ],
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
      } else {
        console.log(`Navegando a: ${subItem}`);
      }
    },
  },
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: rgb(255, 255, 255);
}
#navbar {
  display: flex;
  flex-direction: column;
  background-color: #333;
  color: rgb(255, 255, 255);
  padding: 10px;
}
.navbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.navbar-header button {
  background-color: #444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.navbar-header button:hover {
  background-color: #555;
}
.navbar-menu {
  display: flex;
  justify-content: space-between;
}
.menu-item {
  position: relative;
  margin-right: 20px;
  cursor: pointer;
}
.menu-item span {
  font-weight: bold;
}
.dropdown {
  position: absolute;
  top: 20px;
  left: 0;
  background-color: #444;
  list-style: none;
  margin: 0;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
.dropdown li {
  margin: 5px 0;
  cursor: pointer;
}
.dropdown li:hover {
  color: #ddd;
}
</style>
