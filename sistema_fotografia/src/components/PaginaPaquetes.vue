<template>
  <Navbar :menus="menus" />
  <div id="paquetes">
    <h2>Paquetes actuales</h2>

    <button class="generar-reporte-boton" @click="generarReportePaquetesPDF">Generar Reporte</button>
    <button class="nuevo-paquete-boton" @click="abrirModalNuevo">Nuevo Paquete</button>

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

        <!-- Botón de opciones flotante para editar el paquete -->
        <button class="boton-opciones" @click="abrirModalEditar(paquete)">Editar</button>
      </div>
    </div>

    <!-- Modal para agregar nuevo paquete -->
<div v-if="modalNuevoVisible" class="modal-overlay">
  <div class="modal">
    <h3>Agregar Nuevo Paquete</h3>
    <form @submit.prevent="agregarPaquete">
      <div>
        <label for="nombre">Nombre:</label>
        <input v-model="nuevoPaquete.nombre" type="text" id="nombre" required />
      </div>
      <div>
        <label for="descripcion">Descripción:</label>
        <textarea v-model="nuevoPaquete.descripcion" id="descripcion" required></textarea>
      </div>
      <div>
        <label for="costo">Costo:</label>
        <input v-model="nuevoPaquete.costo" type="text" id="costo" required />
      </div>
      <div>
        <label for="promocion">Promoción:</label>
        <input v-model="nuevoPaquete.promocion" type="text" id="promocion" />
      </div>
      <div>
        <label for="activo">Activo:</label>
        <input v-model="nuevoPaquete.activo" type="checkbox" id="activo" />
      </div>
      <div>
        <label for="imagen">Imagen:</label>
        <input type="file" id="imagen" @change="procesarImagen" />
        <div v-if="nuevoPaquete.imagen" class="imagen-preview">
          <img :src="nuevoPaquete.imagen" alt="Vista previa de la imagen" />
        </div>
      </div>
      <button type="submit">Guardar Paquete</button>
      <button type="button" @click="cerrarModalNuevo">Cancelar</button>
    </form>
  </div>
</div>


    <!-- Modal para editar paquete -->
    <div v-if="modalEditarVisible" class="modal-overlay">
      <div class="modal">
        <h3>Editar Paquete</h3>
        <form @submit.prevent="editarPaquete">
          <div>
            <label for="nombre">Nombre:</label>
            <input v-model="paqueteEditar.nombre" type="text" id="nombre" required />
          </div>
          <div>
            <label for="descripcion">Descripción:</label>
            <textarea v-model="paqueteEditar.descripcion" id="descripcion" required></textarea>
          </div>
          <div>
            <label for="costo">Costo:</label>
            <input v-model="paqueteEditar.costo" type="text" id="costo" required />
          </div>
          <div>
            <label for="promocion">Promoción:</label>
            <input v-model="paqueteEditar.promocion" type="text" id="promocion" />
          </div>
          <div>
            <label for="activo">Activo:</label>
            <input v-model="paqueteEditar.activo" type="checkbox" id="activo" />
          </div>
          <button type="submit">Guardar Cambios</button>
          <button @click="cerrarModalEditar" type="button">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/HeaderComponent.vue';
import logica2 from '../logic/paquetes.js'; 

export default {
  components: {
    Navbar, 
  },
  mixins: [logica2], 
  data() {
    return {
      paquetes: [
        { nombre: "Paquete 1", descripcion: "Descripción del paquete 1", costo: "$100", promocion: "10% descuento", activo: true, imagen: null },
        { nombre: "Paquete 2", descripcion: "Descripción del paquete 2", costo: "$200", activo: false, imagen: null },
        { nombre: "Paquete 3", descripcion: "Descripción del paquete 3", costo: "$300", activo: false, imagen: null },
        { nombre: "Paquete 4", descripcion: "Descripción del paquete 4", costo: "$400", activo: false, imagen: null },
      ],
      modalNuevoVisible: false,
      modalEditarVisible: false,
      nuevoPaquete: {
        nombre: "",
        descripcion: "",
        costo: "",
        promocion: "",
        activo: false,
        imagen: null,
      },
      paqueteEditar: {
        nombre: "",
        descripcion: "",
        costo: "",
        promocion: "",
        activo: false,
        imagen: null,
      },
    };
  },
  methods: {
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
        activo: false,
        imagen: null,
      };
    },
    agregarPaquete() {
      if (this.nuevoPaquete.nombre && this.nuevoPaquete.descripcion && this.nuevoPaquete.costo) {
        this.paquetes.push({ ...this.nuevoPaquete });  // Al agregar un paquete, también se le asigna un botón de editar
        this.cerrarModalNuevo();
      } else {
        alert("Por favor, llena todos los campos obligatorios.");
      }
    },
    abrirModalEditar(paquete) {
      // Copiar los datos del paquete seleccionado para edición
      this.paqueteEditar = { ...paquete };
      this.modalEditarVisible = true;
    },
    cerrarModalEditar() {
      this.modalEditarVisible = false;
      this.paqueteEditar = {
        nombre: "",
        descripcion: "",
        costo: "",
        promocion: "",
        activo: false,
        imagen: null,
      };
    },
    editarPaquete() {
      // Buscar y actualizar el paquete
      const index = this.paquetes.findIndex(p => p.nombre === this.paqueteEditar.nombre);
      if (index !== -1) {
        this.paquetes.splice(index, 1, { ...this.paqueteEditar });  // Reemplazar el paquete editado
        this.cerrarModalEditar();
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.boton-opciones {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
}

.boton-opciones:hover {
  background-color: #0056b3;
}

.modal form button {
  margin-top: 15px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal form button[type="button"] {
  background-color: #f44336;
}

.modal form button:hover {
  background-color: #0056b3;
}

.modal form button[type="button"]:hover {
  background-color: #d32f2f;
}
.generar-reporte-boton,
.nuevo-paquete-boton {
  display: inline-block;
  padding: 10px 20px;
  margin: 10px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #4caf50, #81c784);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.generar-reporte-boton:hover,
.nuevo-paquete-boton:hover {
  background: linear-gradient(45deg, #388e3c, #66bb6a);
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.generar-reporte-boton:active,
.nuevo-paquete-boton:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nuevo-paquete-boton {
  background: linear-gradient(45deg, #2196f3, #64b5f6);
}

.nuevo-paquete-boton:hover {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
}

</style>

