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
          <img v-if="paquete.url" :src="getImageUrl(paquete.url)" alt="Imagen del paquete" id="bundle-image"/>
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
            <label for="costo">Costo:</label>
            <input v-model="nuevoPaquete.costo" type="text" id="costo" required />
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
            <input v-model="paqueteEditar.name" type="text" id="nombre" required />
          </div>
        
          <div>
            <label for="price">Costo:</label>
            <input v-model="paqueteEditar.price" type="text" id="price" required />
          </div>
          
          <div>
            <label for="imagen">Imagen:</label>
            <input type="file" id="imagen" @change="procesarImagenEditar" />
            <div v-if="paqueteEditar.url" class="imagen-preview">
              <img :src="getImageUrl(paqueteEditar.url)" alt="Vista previa de la imagen" />
            </div>
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

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.nuevo-paquete-boton {
  background-color: #0b681b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: block;
  margin: 20px auto;
  transition: background-color 0.3s ease;
}

.nuevo-paquete-boton:hover {
  background-color: #23d400;
}

.paquetes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Tarjetas dinámicas con mejor tamaño */
  gap: 20px;
  justify-items: center;
}

.paquete-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra sutil para un efecto de elevación */
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  max-width: 350px;
}

.paquete-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.paquete-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.paquete-card p {
  font-size: 18px;
  color: #555;
  margin-bottom: 15px;
}

.imagen-placeholder {
  background-color: #f4f4f4;
  height: 200px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #999;
}

.imagen-placeholder img {
  max-height: 100%;
  max-width: 100%;
  border-radius: 5px;
  object-fit: cover;
}

.boton-opciones {
  bottom: 25px;
  right: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 30%;
  width: 55px;
  height: 55px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.modal h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.modal form {
  display: flex;
  flex-direction: column;
}

.modal form div {
  margin-bottom: 15px;
}

.modal form label {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.modal form input, .modal form textarea {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}

.modal form input[type="file"] {
  padding: 5px;
  cursor: pointer;
}

.modal form textarea {
  resize: vertical;
  min-height: 100px;
}

.modal form button {
  margin-top: 20px;
  padding: 12px;
  background-color: #289924;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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

.imagen-preview img {
  width: 100%;
  height: auto;
  border-radius: 5px;
  object-fit: cover;
}
</style>