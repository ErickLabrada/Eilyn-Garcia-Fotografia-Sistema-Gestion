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
    <button class="nuevo-boton" @click="abrirModalNuevo">Nuevo</button>
    <div class="paquetes-grid">
      <div class="paquete-card" v-for="paquete in paquetes" :key="paquete.nombre">
        <h3>{{ paquete.nombre }}</h3>
        <p>{{ paquete.descripcion }}</p>
        <p><strong>{{ paquete.costo }}</strong></p>
        <p v-if="paquete.promocion"><strong>Promoción:</strong> {{ paquete.promocion }}</p>
        <div class="imagen-placeholder">
          <img v-if="paquete.imagen" :src="paquete.imagen" alt="Imagen del paquete" />
          <span v-else>Sin imagen</span>
        </div>
        <button class="opciones-boton" @click="abrirModal(paquete)">Opciones</button>
      </div>
    </div>
  </div>

  <!-- Modal para agregar nuevo paquete -->
  <div v-if="modalNuevoVisible" class="modal-overlay">
    <div class="modal">
      <h3>Nuevo Paquete</h3>
      <form @submit.prevent="agregarPaquete">
        <div class="form-group">
          <label for="nuevoNombre">Nombre:</label>
          <input type="text" id="nuevoNombre" v-model="nuevoPaquete.nombre" required />
        </div>
        <div class="form-group">
          <label for="nuevaDescripcion">Descripción:</label>
          <textarea id="nuevaDescripcion" v-model="nuevoPaquete.descripcion" required></textarea>
        </div>
        <div class="form-group">
          <label for="nuevoCosto">Costo:</label>
          <input type="text" id="nuevoCosto" v-model="nuevoPaquete.costo" required />
        </div>
        <div class="form-group">
          <label for="nuevaPromocion">Promoción:</label>
          <input type="text" id="nuevaPromocion" v-model="nuevoPaquete.promocion" placeholder="Ej: 10% de descuento" />
        </div>
        <div class="form-group">
          <label for="nuevaImagen">Imagen:</label>
          <input type="file" id="nuevaImagen" @change="cargarNuevaImagen" />
        </div>
        <div class="modal-actions">
          <button type="submit">Agregar</button>
          <button type="button" @click="cerrarModalNuevo">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modalVisible" class="modal-overlay">
    <div class="modal">
      <h3>Detalles del Paquete</h3>
      <p><strong>Nombre:</strong> {{ paqueteSeleccionado.nombre }}</p>
      <p><strong>Descripción:</strong> {{ paqueteSeleccionado.descripcion }}</p>
      <p><strong>Costo:</strong> {{ paqueteSeleccionado.costo }}</p>
      <p><strong>Promocion:</strong> {{ paqueteSeleccionado.promocion }}</p>
      <p>
        <strong>Estado:</strong>
        <span>{{ paqueteSeleccionado.activo ? 'Activo' : 'Inactivo' }}</span>
        <button @click="toggleEstadoPaquete">{{ paqueteSeleccionado.activo ? 'Desactivar' : 'Activar' }}</button>
      </p>
      <div class="modal-actions">
        <button @click="abrirEditarPaquete">Editar</button>
        <button @click="eliminarPaquete">Eliminar</button>
        <button @click="cerrarModal">Cerrar</button>
      </div>
    </div>
  </div>

  <!-- Modal para editar paquete -->
  <div v-if="modalEditarVisible" class="modal-overlay">
    <div class="modal">
      <h3>Editar Paquete</h3>
      <form @submit.prevent="guardarCambios">
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="paqueteSeleccionado.nombre" />
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <textarea id="descripcion" v-model="paqueteSeleccionado.descripcion"></textarea>
        </div>
        <div class="form-group">
          <label for="costo">Costo:</label>
          <input type="text" id="costo" v-model="paqueteSeleccionado.costo" />
        </div>
        <div class="form-group">
          <label for="promocion">Promoción:</label>
          <input type="text" id="promocion" v-model="paqueteSeleccionado.promocion" />
        </div>
        <div class="form-group">
          <label for="imagen">Imagen:</label>
          <input type="file" id="imagen" @change="cargarImagen" />
        </div>
        <div class="modal-actions">
          <button type="submit">Guardar</button>
          <button type="button" @click="cerrarEditarModal">Cancelar</button>
        </div>
      </form>
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
        { nombre: "Paquete 1", descripcion: "Descripción del paquete 1", costo: "$100", promocion: "10% descuento", activo: true, imagen: null },
        { nombre: "Paquete 2", descripcion: "Descripción del paquete 2", costo: "$200", activo: false, imagen: null },
        { nombre: "Paquete 3", descripcion: "Descripción del paquete 3", costo: "$300", activo: false, imagen: null },
        { nombre: "Paquete 4", descripcion: "Descripción del paquete 4", costo: "$400", activo: false, imagen: null },
      ],
      modalVisible: false,
      modalEditarVisible: false,
      modalNuevoVisible: false,
      paqueteSeleccionado: null,
      nuevoPaquete: {
        nombre: "",
        descripcion: "",
        costo: "",
        promocion: "",
        imagen: null,
      },
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
    abrirModal(paquete) {
      this.paqueteSeleccionado = { ...paquete };
      this.modalVisible = true;
    },
    cerrarModal() {
      this.modalVisible = false;
      this.paqueteSeleccionado = null;
    },
    abrirEditarPaquete() {
      this.modalVisible = false;
      this.modalEditarVisible = true;
    },
    cerrarEditarModal() {
      this.modalEditarVisible = false;
      this.paqueteSeleccionado = null;
    },
    guardarCambios() {
      const index = this.paquetes.findIndex((p) => p.nombre === this.paqueteSeleccionado.nombre);
      if (index !== -1) {
        this.paquetes[index] = { ...this.paqueteSeleccionado };
        console.log("Paquete actualizado:", this.paqueteSeleccionado);
      }
      this.cerrarEditarModal();
    },
    cargarImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.paqueteSeleccionado.imagen = URL.createObjectURL(file);
      }
    },
    eliminarPaquete() {
      const index = this.paquetes.findIndex((p) => p.nombre === this.paqueteSeleccionado.nombre);
      if (index !== -1) {
        this.paquetes.splice(index, 1);
        console.log("Paquete eliminado");
      }
      this.cerrarModal();
    },
    toggleEstadoPaquete() {
      this.paqueteSeleccionado.activo = !this.paqueteSeleccionado.activo;
      console.log("Estado del paquete actualizado:", this.paqueteSeleccionado.activo);
    },
    abrirModalNuevo() {
      this.modalNuevoVisible = true;
    },
    cerrarModalNuevo() {
      this.modalNuevoVisible = false;
      this.nuevoPaquete = {
        nombre: "",
        descripcion: "",
        costo: "",
        promocion: "",
        imagen: null,
      };
    },
    agregarPaquete() {
      this.paquetes.push({ ...this.nuevoPaquete });
      this.cerrarModalNuevo();
    },
    cargarNuevaImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.nuevoPaquete.imagen = URL.createObjectURL(file);
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}
.modal-actions button {
  margin: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal-actions button:hover {
  background-color: #ddd;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}
.modal-actions button {
  margin: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal-actions button:hover {
  background-color: #ddd;
}
.form-group {
  margin-bottom: 15px;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>
