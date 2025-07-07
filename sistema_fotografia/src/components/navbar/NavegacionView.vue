<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-gradient">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="#" @click="navigateToInicio">Sistema de fotografía</a>
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
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
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

        <div class="dropdown">
          <button class="btn btn-profile dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle me-1"></i> Perfil
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Mi cuenta</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" @click="logout"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a></li>
          </ul>
        </div>
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
          title: "Clientes y Citas",
          items: [
            "Administrar citas",
            "Consultar cliente",
            "Mandar recordatorios",
          ],
        },
        {
          title: "Paquetes y consultas",
          items: [
            "Administrar paquetes",
            "Consultar paquete con permiso de publicación",
          ],
        },
        {
          title: "Inventario y Entregas",
          items: [
            "Solicitar material",
            "Agendar entregas",
          ],
        },
        {
          title: "Empleados",
          items: [
            "Administrar empleados",
          ],
        },
        {
          title: "Reportes",
          items: [
            "Reporte de ventas",
          ],
        },
      ]
    };
  },
  methods: {
    navigate(subItem) {
      if (subItem === "Administrar citas") {
        this.$router.push("/administrarCitas");
      } else if (subItem === "Administrar paquetes") {
        this.$router.push("/paquetes");
      } else if (subItem === "Administrar empleados") {
        this.$router.push("/empleados");
    
      } else if (subItem === "Solicitar material") {
        this.$router.push("/materiales");
      } else if (subItem === "Mandar recordatorios") {
        this.$router.push("/recordatorio");
      } else if (subItem === "Agendar entregas") {
        this.$router.push("/entregas");
      } else if (subItem === "Reporte de ventas") {
        this.$router.push("/reporteVentas");
      } else {
        console.log(`Opción no configurada: ${subItem}`);
      }
    },
    navigateToInicio() {
      this.$router.push('/inicio');
    },
    logout() {
      console.log("Cerrando sesión...");
      this.$router.push('/inicioSesion');
    },
  },
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #2c3e50, #4a5a6a);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  color: #f8f9fa;
  font-size: 1.5rem;
  transition: color 0.3s;
}

.navbar-brand:hover {
  color: #ffffff;
}

.nav-link {
  color: #e9ecef !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
  margin: 0 0.2rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-link:hover, .nav-link:focus {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff !important;
}

.dropdown-menu {
  background-color: #f8f9fa;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.dropdown-item {
  color: #495057;
  padding: 0.5rem 1.5rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #e9ecef;
  color: #212529;
}

.btn-profile {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 0.375rem 1rem;
  transition: all 0.3s;
}

.btn-profile:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.1);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.dropdown-toggle::after {
  transition: transform 0.2s ease-in-out;
}
</style>
