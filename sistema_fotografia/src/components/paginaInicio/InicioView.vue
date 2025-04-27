<template>
  <div>
  
    <Navbar :menus="menus" />
    <div id="photoCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="carousel-items">
            <img src="../../assets/imgcarrusel.jpg" class="d-block w-100" alt="Imagen 1" />
            
           
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-items">
            <img src="../../assets/imgcarrusel2.jpg" class="d-block w-100" alt="Imagen 4" />
           
          </div>
        </div>
      </div>

      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#photoCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#photoCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <div class="container mt-5">
      <div class="row">
        <div class="col-md-4">
          <h3 class="text-center">Paquetes actuales</h3>
          <div class="package-item mb-3" v-for="paquete in paquetes" :key="paquete.nombre">
            <div class="p-3 bg-light rounded shadow-sm">
              <h5>{{ paquete.nombre }}</h5>
              <p>{{ paquete.descripcion }}</p>
              <p><strong>Costo: </strong>{{ paquete.costo }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <h3 class="text-center">Próximos eventos</h3>
          <div class="event-item mb-3" v-for="evento in eventos" :key="evento.id">
            <div class="p-3 bg-light rounded shadow-sm">
              <p><strong>Día: </strong>{{ evento.dia }}</p>
              <p><strong>Lugar: </strong>{{ evento.lugar }}</p>
              <p><strong>Hora: </strong>{{ evento.hora }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <h3 class="text-center">Promociones actuales</h3>
          <div class="promotion-item mb-3" v-for="promocion in promociones" :key="promocion.nombre">
            <div class="p-3 bg-light rounded shadow-sm">
              <h5>{{ promocion.nombre }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '../../components/navbar/NavegacionView.vue';
import logica1 from '../../logic/paginaInicial.js'; 

export default {
  components: {
    Navbar, 
  },
  mixins: [logica1], 
};
</script>
<style scoped>
@import '../../assets/styles.css'; 
</style>
