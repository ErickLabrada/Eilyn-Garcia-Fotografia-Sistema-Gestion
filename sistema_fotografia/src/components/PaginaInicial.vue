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
        <!-- Paquetes actuales -->
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

        <!-- Próximos eventos -->
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

        <!-- Promociones actuales -->
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
export default {
  data() {
    return {
      loading: true, 
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
          items: ["Reporte de ventas por paquete", "Reporte de ventas por evento"],
        },
      ],
      paquetes: [],
      eventos: [],
      promociones: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;

      
      setTimeout(() => {
        this.paquetes = [
          { nombre: "Paquete Básico", descripcion: "Sesión de 30 min.", costo: "$50" },
          { nombre: "Paquete Premium", descripcion: "Sesión de 2 horas.", costo: "$150" },
          { nombre: "Paquete Deluxe", descripcion: "Cobertura de evento completo.", costo: "$300" },
        ];
        this.eventos = [
          { id: 1, dia: "25/11/2024", lugar: "Plaza Central", hora: "10:00 AM" },
          { id: 2, dia: "30/11/2024", lugar: "Parque Norte", hora: "2:00 PM" },
          { id: 3, dia: "05/12/2024", lugar: "Estudio Fotográfico", hora: "5:00 PM" },
        ];
        this.promociones = [
          { nombre: "Descuento del 20% en sesiones navideñas" },
          { nombre: "2x1 en sesiones de pareja" },
          { nombre: "Promoción especial para eventos empresariales" },
        ];

        this.loading = false; 
      }, 1500); 
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
body {
  font-family: Arial, sans-serif;
  background-color: #d63666;
}

.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-text {
  font-weight: 500;
  color: #212529;
}

.dropdown-menu {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  color: #212529;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.btn-outline-danger {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

#photoCarousel {
  width: 100%;  
  height: 350px;  
  margin: 0 auto;
  display: flex;
  overflow: hidden;
}

.carousel-inner {
  display: flex; 
}

.carousel-item {
  flex: 0 0 auto; 
  width: 100%;  
  display: flex;  
}

.carousel-items {
  display: flex;  
  width: 100%;
}

.carousel-inner img {
  width: 33.33%;  
  height: 100%;
  object-fit: cover;  
}

.carousel-control-prev, .carousel-control-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.carousel-control-prev-icon, .carousel-control-next-icon {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 10px;
}

.package-item, .event-item, .promotion-item {
  border: 1px solid #ddd;
  border-radius: 5px;
}

h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}
</style>
