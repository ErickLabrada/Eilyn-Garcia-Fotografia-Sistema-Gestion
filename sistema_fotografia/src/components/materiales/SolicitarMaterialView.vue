<template>
  <Navbar :menus="menus" />
  <div class="material-request">
    <header>
      <h1>Solicitar Material Fotográfico</h1>
      <button @click="showForm = !showForm" class="toggle-btn">
        {{ showForm ? 'Cancelar' : '+ Nueva Solicitud' }}
      </button>
    </header>

    <form v-if="showForm" @submit.prevent="submitRequest" class="request-form">
      <!-- Datos del evento -->
      <div class="form-section">
        <h2>Datos del Evento</h2>

        <div class="form-group">
          <label>Nombre del cliente:</label>
          <select v-model="form.clientId" @change="updatePhone" required>
            <option disabled value="">Seleccione un cliente</option>
            <option v-for="client in clientes" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>

          <label>Teléfono:</label>
          <input v-model="form.phone" type="tel" readonly />
        </div>

        <div class="form-group">
          <label>Nombre del proveedor:</label>
          <select v-model="form.providerId" @change="updateProveedorPhone" required>
            <option disabled value="">Seleccione un proveedor</option>
            <option v-for="prov in proveedores" :key="prov.id" :value="prov.id">
              {{ prov.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Teléfono:</label>
          <input v-model="form.providerPhone" type="tel" readonly />
        </div>

<div class="form-section">
  <h2>Agregar Nuevo Proveedor</h2>

  <form @submit.prevent="agregarProveedor" class="provider-form">
    <div class="form-group">
      <label>Nombre del Proveedor:</label>
      <input v-model="nuevoProveedor.name" type="text" required />
    </div>

    <div class="form-group">
      <label>Teléfono:</label>
      <input v-model="nuevoProveedor.phone" type="tel" required />
    </div>

    <div class="form-group">
      <label>Materiales que ofrece:</label>
      <div v-for="item in items" :key="item.id" class="material-checkbox">
        <label>
          <input type="checkbox" :value="item.id" v-model="nuevoProveedor.itemsID" />
          {{ item.name }} - {{ item.description }}
        </label>
      </div>
    </div>

    <button type="submit" class="submit-btn">Agregar Proveedor</button>
  </form>
</div>


        <div class="form-group">
          <label>Tipo de evento:</label>
          <select v-model="form.eventType" id="event" required>
            <option disabled value="">Seleccione un tipo</option>
            <option v-for="event in eventTypes" :key="event.id" :value="event.id">
              {{ event.event }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Fecha de entrega del material:</label>
          <input v-model="form.eventDate" type="date" required :min="minDate" />
        </div>
      </div>

      <!-- Items -->
    
<div class="form-section">
  <h2>Materiales / Items Requeridos</h2>
  <div class="materials-grid" :class="{ disabled: !form.providerId }">

    <template v-if="filteredItems && filteredItems.length">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="material-item"
      >
        <label class="material-checkbox">
          <input
            type="checkbox"
            v-model="form.selectedItems"
            :value="item.id"
            :disabled="!form.providerId"
          />
          <span class="checkmark"></span>
          <div class="material-info">
            <strong>{{ item.name }}</strong>
            <span>{{ item.description }}</span>
          </div>
        </label>

        <input
          v-if="form.selectedItems.includes(item.id)"
          v-model.number="itemQuantities[item.id]"
          type="number"
          min="1"
          class="quantity-input"
          @click.stop
        />
      </div>
    </template>

    <p v-else class="no-items">
      Seleccione un proveedor para ver los materiales disponibles.
    </p>
  </div>
</div>


      <!-- Notas -->
      <div class="form-section">
        <h2>Detalles Adicionales</h2>
        <textarea
          v-model="form.notes"
          placeholder="Especificaciones especiales..."
        ></textarea>
      </div>

      <!-- Botones -->
      <div class="form-actions">
        <button type="button" @click="resetForm" class="cancel-btn">Cancelar</button>
        <button type="submit" class="submit-btn">Enviar Solicitud</button>
      </div>
    </form>

    <!-- Lista de solicitudes -->
    <div class="requests-list">
      <h2>Solicitudes Recientes</h2>

      <div v-if="loading" class="loading">Cargando...</div>
      <div v-else-if="requests.length === 0" class="empty-state">
        No hay solicitudes registradas.
      </div>

      <div v-for="request in requests" :key="request.id" class="request-card">
        <div class="request-header">
          <h3>{{ request.clientName }}</h3>
          <span class="status-badge" :class="request.status">{{ request.status }}</span>
        </div>

        <div class="request-details">
          <p><strong>Evento:</strong> {{ getEventName(request.eventType) }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(request.eventDate) }}</p>
          <p><strong>Materiales:</strong></p>
          <ul>
            <li v-for="item in request.materials" :key="item.id">
              {{ item.name }} (x{{ item.quantity }})
            </li>
          </ul>
          <p v-if="request.notes"><strong>Notas:</strong> {{ request.notes }}</p>
        </div>

        <div class="request-footer">
          <small>Solicitado el: {{ formatDateTime(request.createdAt) }}</small>
          <button 
            v-if="request.status === 'pendiente'" 
            @click="cancelRequest(request.id)"
            class="cancel-request-btn"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import emailjs from 'emailjs-com';
import Navbar from '../../components/navbar/NavegacionView.vue';
import proveedor from './proveedor.js';
import items from './items';
import logica2 from '../../logic/paquetes.js';
import clients from './clients.js';

export default {
  components: { Navbar },
  mixins: [logica2, proveedor, items, clients],

  data() {
    return {
      showForm: false,
      loading: false,
      requests: [],
      eventTypes: [],
      proveedores: [], 
      clientes: [],
      itemQuantities: {},
      form: {
        clientId: '',
        phone: '',
        eventType: null,
        eventDate: '',
        providerId: '',
        providerPhone: '',
        selectedItems: [],
        notes: '',
        email: '',
        message: ''
      },
      minDate: new Date().toISOString().split('T')[0]
    };
  },

  async created() {
    await this.fetchInitialData();
  },

  computed: {
    filteredItems() {
      const proveedor = this.proveedores.find(p => p.id === this.form.providerId);
      return proveedor ? proveedor.items : [];
    }
  },

  watch: {
    'form.providerId'() {
      this.form.selectedItems = [];
      Object.keys(this.itemQuantities).forEach(key => {
        this.itemQuantities[key] = 1;
      });
    }
  },

  methods: {
    async fetchInitialData() {
      try {
        const [eventsRes, itemsRes, clientsRes, proveedoresRes] = await Promise.all([
          fetch('http://localhost:3001/events').then(res => res.json()),
          fetch('http://localhost:3001/items').then(res => res.json()), 
          fetch('http://localhost:3001/clients').then(res => res.json()),
          fetch('http://localhost:3001/providers').then(res => res.json())
        ]);


         if (!proveedoresRes || !Array.isArray(proveedoresRes)) {
      throw new Error("No se pudieron cargar los proveedores.");
    }

        this.eventTypes = eventsRes;
        this.items = itemsRes;
        this.clientes = clientsRes;
        this.proveedores = proveedoresRes;
        proveedoresRes.forEach(p => {
          (p.items || []).forEach(item => {
            this.itemQuantities[item.id] = 1;
          });
        });

      } catch (error) {
        console.error("Error cargando datos:", error);
        alert("Hubo un error al cargar la información");
      }
    },

    getEventName(eventId) {
      const event = this.eventTypes.find(e => e.id === eventId);
      return event ? event.event : '--';
    },

    updatePhone() {
      const selectedClient = this.clientes.find(c => c.id === this.form.clientId);
      this.form.phone = selectedClient ? selectedClient.phone : '';
    },

    updateProveedorPhone() {
      const selectedProveedor = this.proveedores.find(p => p.id === this.form.providerId);
      this.form.providerPhone = selectedProveedor ? selectedProveedor.phone : '';
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('es-MX');
    },

    resetForm() {
      this.form = {
        clientId: '',
        phone: '',
        eventType: null,
        eventDate: '',
        providerId: '',
        providerPhone: '',
        selectedItems: [],
        notes: '',
        email: '',
        message: ''
      };
      this.showForm = false;
    },

    async submitRequest() {
      try {
        const selectedItems = this.form.selectedItems.map(id => {
          // Buscamos item en proveedores
          const item = this.proveedores
            .flatMap(p => p.items)
            .find(i => i.id === id);

          return `${item?.name || 'Desconocido'} (x${this.itemQuantities[id] || 1})`;
        }).join(', ');

        const selectedProvider = this.proveedores.find(p => p.id === this.form.providerId);

        const emailParams = {
          client_name: this.clientes.find(c => c.id === this.form.clientId)?.name || '',
          phone: this.form.phone,
          provider: selectedProvider?.name || '',
          provider_phone: this.form.providerPhone,
          event_date: this.form.eventDate,
          event_type: this.getEventName(this.form.eventType),
          selected_items: selectedItems,
          notes: this.form.notes,
          email: this.form.email,
          message: this.form.message
        };

        await emailjs.send(
          'service_mue6u1e',
          'template_r2yiyww',
          emailParams,
          'HyMf4uLXj_anD5EEc'
        );

        alert('Solicitud enviada correctamente por correo');
        this.resetForm();
      } catch (error) {
        console.error('Error al enviar correo:', error);
        alert('Ocurrió un error al enviar el correo');
      }
    }
  }
};
</script>


  <style scoped>
  .materials-grid.disabled {
  opacity: 0.5;
  pointer-events: none;
}

  .material-request {
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
  
  .toggle-btn {
    background: #2196F3;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  /* Formulario */
  .request-form {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .form-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #ddd;
  }
  
  .form-section:last-child {
    border-bottom: none;
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
  .form-group select,
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  textarea {
    min-height: 80px;
    resize: vertical;
  }
  
  /* Materiales */
  .materials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .material-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: white;
  }
  
  .material-checkbox {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
  }
  
  .material-checkbox input {
    display: none;
  }
  
  .checkmark {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #2196F3;
    border-radius: 4px;
    margin-right: 10px;
    position: relative;
  }
  
  .material-checkbox input:checked ~ .checkmark {
    background: #2196F3;
  }
  
  .material-checkbox input:checked ~ .checkmark::after {
    content: "✓";
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .material-info {
    flex: 1;
  }
  
  .material-info span {
    display: block;
    font-size: 0.9em;
    color: #666;
  }
  
  .material-info small {
    color: #888;
    font-size: 0.8em;
  }
  
  .quantity-input {
    width: 50px;
    margin-left: 10px;
    padding: 5px;
  }
  
  /* Botones */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-btn {
    background: #f44336;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .submit-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  /* Lista de solicitudes */
  .requests-list {
    margin-top: 40px;
  }
  
  .request-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    background: white;
  }
  
  .request-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .status-badge {
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: bold;
  }
  
  .status-badge.pendiente {
    background: #FFC107;
    color: #333;
  }
  
  .status-badge.aprobada {
    background: #4CAF50;
    color: white;
  }
  
  .status-badge.cancelada {
    background: #f44336;
    color: white;
  }
  
  .request-details p {
    margin: 5px 0;
  }
  
  .request-details ul {
    margin: 5px 0 5px 20px;
  }
  
  .request-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #eee;
    font-size: 0.9em;
    color: #666;
  }
  
  .cancel-request-btn {
    background: none;
    border: 1px solid #f44336;
    color: #f44336;
    padding: 3px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8em;
  }
  
  /* Estados */
  .loading, .empty-state {
    text-align: center;
    padding: 40px;
    color: #666;
  }
  </style>