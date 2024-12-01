<template>
    
    <Navbar :menus="menus" />
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
  import Navbar from '../components/HeaderComponent.vue';
  import logica from '../logic/ventas.js'; 

  export default {
  components: {
    Navbar, 
  },
  mixins: [logica], 
};
  </script>
  
  <style scoped>
@import '../assets/styles.css'; 
  </style>
  