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

  <div id="paquetes">
    <h2>Paquetes actuales</h2>
    <button class="nuevo-boton" @click="abrirModalNuevo">Nuevo</button>
    <button class="generar-reporte-boton" @click="generarReportePaquetesPDF">Generar Reporte</button>

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
import logica2 from '../logic/paquetes.js'; 

export default {
  mixins: [logica2], 
};
</script>
<style scoped>
@import '../assets/styles.css'; 
</style>

