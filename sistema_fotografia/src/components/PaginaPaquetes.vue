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

  <div id="paquetes">
    <h2>Paquetes actuales</h2>
    <button class="nuevo-boton" @click="nuevoPaquete">Nuevo</button>
    <div class="paquetes-grid">
      <div class="paquete-card" v-for="paquete in paquetes" :key="paquete.nombre">
        <h3>{{ paquete.nombre }}</h3>
        <p>{{ paquete.descripcion }}</p>
        <p><strong>{{ paquete.costo }}</strong></p>
        <div class="imagen-placeholder">Imagen</div>
        <button class="opciones-boton">Opciones</button>
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
      paquetes: [
        { nombre: "Paquete 1", descripcion: "Descripción del paquete 1", costo: "$100" },
        { nombre: "Paquete 2", descripcion: "Descripción del paquete 2", costo: "$200" },
        { nombre: "Paquete 3", descripcion: "Descripción del paquete 3", costo: "$300" },
        { nombre: "Paquete 4", descripcion: "Descripción del paquete 4", costo: "$400" },
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
      if (subItem === "Administrar paquetes") {
        this.$router.push("/paquetes");
      } else {
        console.log(`Navegando a: ${subItem}`);
      }
    },
    nuevoPaquete() {
      console.log("Crear nuevo paquete...");
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
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}


#navbar {
  display: flex;
  flex-direction: column;
  background-color: #333;
  color: #fff;
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
}
.menu-item {
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
  padding: 10px;
  border-radius: 4px;
  z-index: 1000;
}
.dropdown li:hover {
  color: #ddd;
}


#paquetes {
  padding: 20px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.nuevo-boton {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.nuevo-boton:hover {
  background-color: #555;
}
.paquetes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.paquete-card {
  background-color: #ddd;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}
.paquete-card h3 {
  margin-bottom: 10px;
}
.imagen-placeholder {
  background-color: #f5f5f5;
  height: 100px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #999;
}
.opciones-boton {
  padding: 5px 10px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.opciones-boton:hover {
  background-color: #555;
}
</style>
