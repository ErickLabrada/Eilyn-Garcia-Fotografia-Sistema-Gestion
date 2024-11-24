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
                :class="{ 'active-menu': activeMenu === menu.title }"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                @click="activeMenu = menu.title"
              >
                {{ menu.title }}
              </a>
              <ul class="dropdown-menu">
                <li
                  v-for="subItem in menu.items"
                  :key="subItem"
                  @click="navigate(subItem)"
                >
                  <a
                    class="dropdown-item"
                    href="#"
                    :class="{ 'active-subitem': activeSubItem === subItem }"
                  >
                    {{ subItem }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
  
          <span class="navbar-text me-3">Usuario: (Nombre de usuario)</span>
  
          <button class="btn btn-outline-danger" @click="logout">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  
    <div class="container mt-5">
      <h2 class="text-center">Reportes de ventas</h2>
      <div class="row justify-content-center mt-3">
        <div class="col-md-3">
          <label for="fecha-desde">Fecha: desde</label>
          <input
            type="date"
            id="fecha-desde"
            class="form-control"
            v-model="filters.startDate"
          />
        </div>
        <div class="col-md-3">
          <label for="fecha-hasta">Fecha: hasta</label>
          <input
            type="date"
            id="fecha-hasta"
            class="form-control"
            v-model="filters.endDate"
          />
        </div>
        <div class="col-md-3">
          <label for="paquete">Por paquete</label>
          <select id="paquete" class="form-control" v-model="filters.package">
            <option value="">Selecciona un paquete</option>
            <option value="paquete1">Paquete 1</option>
            <option value="paquete2">Paquete 2</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-dark w-100" @click="generateReport">
            Generar
          </button>
        </div>
      </div>
      <div class="mt-4">
        <div class="card">
          <div class="card-header">Resultados obtenidos</div>
          <div class="card-body" style="background-color: #ffeeee; height: 200px;">
            <p v-if="!dataAvailable">No hay datos disponibles</p>
            <ul v-else>
              <li v-for="(dato, index) in datos" :key="index">{{ dato }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-3 text-end">
        <button class="btn btn-dark" @click="exportData">Exportar</button>
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
  </script>
  
  <style scoped>
  .navbar {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #3a4046 !important;
  }
  
  .navbar-text {
    font-weight: 500;
    color: #f8f9fa;
  }
  
  .active-menu {
    font-weight: bold;
    color: #ffffff !important;
  }
  
  .active-subitem {
    font-weight: bold;
    background-color: #f8f9fa !important;
  }
  
  .card-header {
    font-weight: bold;
    background-color: #f8f9fa;
  }
  </style>
  