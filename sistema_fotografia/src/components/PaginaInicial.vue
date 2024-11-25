<template>
  <div>
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

          <span class="navbar-text me-3">Usuario: (Nombre de usuario)</span>

          <button class="btn btn-outline-danger" @click="logout">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>

    <div id="photoCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="carousel-items">
            <img src="../assets/imgcarrusel.jpg" class="d-block w-100" alt="Imagen 1" />
            <img src="../assets/imgcarrusel2.jpg" class="d-block w-100" alt="Imagen 2" />
            <img src="../assets/imgcarrusel.jpg" class="d-block w-100" alt="Imagen 3" />
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-items">
            <img src="../assets/imgcarrusel2.jpg" class="d-block w-100" alt="Imagen 4" />
            <img src="../assets/imgcarrusel.jpg" class="d-block w-100" alt="Imagen 5" />
            <img src="../assets/imgcarrusel2.jpg" class="d-block w-100" alt="Imagen 6" />
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
import logica1 from '../logic/paginaInicial.js'; 

export default {
  mixins: [logica1], 
};
</script>
<style scoped>
@import '../assets/styles.css'; 
</style>
