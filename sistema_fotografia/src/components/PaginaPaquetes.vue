<template>
  <Navbar :menus="menus" />
  <div id="paquetes">
    <h2>Paquetes actuales</h2>

    
    <button class="nuevo-paquete-boton" @click="abrirModalNuevo">Nuevo Paquete</button>

    <div class="paquetes-grid">
      <div class="paquete-card" v-for="paquete in paquetes" :key="paquete.name">
        <h3>{{ paquete.name }}</h3>
        <p><strong>${{ paquete.price }}</strong></p>
      
        <div class="imagen-placeholder">
          <img v-if="paquete.url" :src="getImageUrl(paquete.url)" alt="Imagen del paquete"  id="bundle-image"/>
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
      paquetes: [],
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
  created() {
    this.fetchPaquetes();
  },
  methods: {
    getImageUrl(url) {
      try {
        return require(`../assetsbundles/${url}`);
      } catch (e) {
        return null;
      }
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
        activo: false,
        imagen: null,
      };
    },
    agregarPaquete() {
      if (this.nuevoPaquete.nombre && this.nuevoPaquete.descripcion && this.nuevoPaquete.costo) {
        this.paquetes.push({ ...this.nuevoPaquete });
        this.cerrarModalNuevo();
      } else {
        alert("Por favor, llena todos los campos obligatorios.");
      }
    },
    procesarImagen(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.nuevoPaquete.imagen = e.target.result;
        };
        reader.readAsDataURL(file);
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
.imagen-placeholder img{
  width: 200px;
  height: 100px;
  object-fit: cover;
}

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
</style>