<template>
  <Navbar :menus="menus" />
  <div class="admin-promotions">
    <!-- Header -->
    <header>
      <h1>Administrador de Promociones</h1>
      <button @click="showForm = !showForm" class="btn-action schedule-btn">
        {{ showForm ? 'Cancelar' : '+ Nueva Promoción' }}
      </button>
    </header>

    <!-- Formulario (condicional) -->
    <form v-if="showForm" @submit.prevent="handleSubmit" class="promo-form">
      <h2>{{ editingId ? 'Editar' : 'Crear' }} Promoción</h2>

      <div class="form-group">
        <label>Nombre:</label>
        <input v-model="form.name" required placeholder="Ej: Bodas Premium 50% OFF" />
      </div>

      <div class="form-group">
        <label>Precio promoción ($):</label>
        <input v-model="form.price" type="number" min="0" required />
      </div>

      <div class="form-group">
        <label>Precio original ($):</label>
        <input v-model="form.originalPrice" type="number" min="0" />
      </div>

      <div class="form-group">
        <label>Fecha expiración:</label>
        <input v-model="form.expiryDate" type="date" :min="new Date().toISOString().split('T')[0]" required />
      </div>

<div class="form-group">
        <label>Seleccione paquete:</label>
        <select v-model="form.eventTypeId" required>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.event }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Tipo de evento:</label>
        <select v-model="form.eventTypeId" required>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.event }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Imagen (URL):</label>
        <input v-model="form.url" placeholder="Ej: promo_bodas.jpg" />
        <small v-if="form.url">Previsualización:</small>
        <img v-if="form.url" :src="`http://localhost:3001/assets/${form.url}`" class="preview-img" />
      </div>

      <button type="submit" class="save-btn">{{ editingId ? 'Actualizar' : 'Guardar' }}</button>
    </form>

    <!-- Lista de promociones -->
    <div class="promo-list">
      <div v-if="loading" class="loading">Cargando...</div>
      <div v-else-if="promotions.length === 0" class="empty-state">
        No hay promociones activas.
      </div>

      <div v-for="promo in promotions" :key="promo.id" class="promo-card">
        <div class="promo-header">
          <h3>{{ promo.name }}</h3>
          <span class="badge" :class="{ 'expired': isExpired(promo.expiryDate) }">
            {{ isExpired(promo.expiryDate) ? 'Expirada' : daysLeft(promo.expiryDate) }}
          </span>
        </div>

        <img v-if="promo.url" :src="`http://localhost:3001/assets/${promo.url}`" alt="Promo" class="promo-img" />

        <div class="promo-details">
          <p><strong>Precio:</strong> ${{ promo.price }} <s v-if="promo.originalPrice">${{ promo.originalPrice }}</s></p>
          <p><strong>Válido hasta:</strong> {{ formatDate(promo.expiryDate) }}</p>
          <p><strong>Evento:</strong> {{ getEventName(promo.eventTypeId) }}</p>
        </div>

        <div class="promo-actions">
          <button @click="editPromo(promo)" class="edit-btn">✏️ Editar</button>
          <button @click="deletePromo(promo.id)" class="delete-btn">🗑️ Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../../components/navbar/NavegacionView.vue';
import paquetes from '../..logic/ paquetes.js';

export default {
  components: {
    Navbar,
    mixins: [paquetes],
  },
  data() {
    return {
      showForm: false,
      loading: true,
      promotions: [],
      events: [],
      editingId: null,
      form: {
        name: '',
        price: '',
        originalPrice: '',
        expiryDate: '',
        eventTypeId: null,
        url: ''
      }
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const [promosRes, eventsRes] = await Promise.all([
          axios.get('http://localhost:3001/sale-bundles/active'),
          axios.get('http://localhost:3001/events')
        ]);
        this.promotions = promosRes.data;
        this.events = eventsRes.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error al cargar datos');
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      try {
        const url = this.editingId 
          ? `http://localhost:3001/sale-bundles/${this.editingId}`
          : 'http://localhost:3001/sale-bundles';
        
        const method = this.editingId ? 'put' : 'post';

        await axios[method](url, this.form);
        this.resetForm();
        await this.fetchData();
      } catch (error) {
        console.error('Error saving promo:', error);
        alert('Error al guardar');
      }
    },
    editPromo(promo) {
      this.form = { ...promo };
      this.editingId = promo.id;
      this.showForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async deletePromo(id) {
      if (!confirm('¿Eliminar esta promoción?')) return;
      
      try {
        await axios.delete(`http://localhost:3001/sale-bundles/${id}`);
        await this.fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error al eliminar');
      }
    },
    resetForm() {
      this.form = {
        name: '',
        price: '',
        originalPrice: '',
        expiryDate: '',
        eventTypeId: null,
        url: ''
      };
      this.editingId = null;
      this.showForm = false;
    },
    // Helpers
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('es-MX');
    },
    daysLeft(expiryDate) {
      const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return `${days} días restantes`;
    },
    isExpired(expiryDate) {
      return new Date(expiryDate) < new Date();
    },
    getEventName(eventId) {
      const event = this.events.find(e => e.id === eventId);
      return event ? event.event : '--';
    }
  }
};
</script>

<style scoped>
.admin-promotions {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.btn-action {
  background: #2196F3;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.promo-form {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview-img {
  max-width: 200px;
  max-height: 150px;
  display: block;
  margin-top: 10px;
  border: 1px solid #ddd;
}

.save-btn {
  background: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}

.promo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.promo-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.promo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.promo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.promo-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  background: #4CAF50;
  color: white;
}

.badge.expired {
  background: #f44336;
}

.promo-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.promo-details {
  padding: 15px;
}

.promo-details p {
  margin: 5px 0;
}

.promo-actions {
  display: flex;
  padding: 10px 15px;
  border-top: 1px solid #eee;
}

.promo-actions button {
  flex: 1;
  padding: 8px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background: #FFC107;
  color: #333;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.loading, .empty-state {
  text-align: center;
  padding: 40px;
  grid-column: 1 / -1;
  color: #666;
}
</style>
