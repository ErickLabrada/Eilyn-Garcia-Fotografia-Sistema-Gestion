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
  import logica from '../logic/ventas.js'; 

export default {
  mixins: [logica], 
};
  </script>
  
  <style scoped>
@import '../assets/styles.css'; 
  </style>
  