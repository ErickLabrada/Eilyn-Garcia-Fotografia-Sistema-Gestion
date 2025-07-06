<template>
  <Navbar :menus="menus" />
  <div class="material-request">
    <header>
      <h1>Solicitar Material Fotográfico</h1>
      <button @click="toggleForm" class="toggle-btn">
        {{ showForm ? 'Cancelar' : '+ Nueva Solicitud' }}
      </button>
    </header>

    <!-- Formulario principal -->
    <form
      v-if="showForm && clientes.length && proveedores.length && eventTypes.length"
      @submit.prevent="submitRequest"
      class="request-form"
    >
      <!-- Tabs de navegación -->
      <div class="form-tabs">
        <button
          type="button"
          :class="{ active: activeSection === 'cliente' }"
          @click="activeSection = 'cliente'"
        >
          Cliente
        </button>
        <button
          type="button"
          :class="{ active: activeSection === 'proveedor' }"
          @click="activeSection = 'proveedor'"
        >
          Proveedor
        </button>
        <button
          type="button"
          :class="{ active: activeSection === 'detalles' }"
          @click="activeSection = 'detalles'"
        >
          Detalles del Evento
        </button>
      </div>

      <!-- Sección Cliente -->
      <div v-if="activeSection === 'cliente'" class="form-section">
        <h2>Datos del Cliente</h2>
        <div class="form-group">
          <label>Nombre del cliente:</label>
          <select v-model="form.clientId" @change="updatePhone" required>
            <option disabled value="">Seleccione un cliente</option>
            <option v-for="client in clientes" :key="client.id" :value="client.id">
              {{ client?.name ?? 'Nombre no disponible' }}
            </option>
          </select>

          <label>Teléfono:</label>
          <input v-model="form.phone" type="tel" readonly />
        </div>
        <div class="form-group">
  <label>Contrato:</label>
  <select v-model="form.contractId" required>
    <option disabled value="">Seleccione un contrato</option>
    <option
      v-for="contract in filteredContracts"
      :key="contract.id"
      :value="contract.id"
    >
      {{ `#${contract.id} - ${contract.celebratedName} - $${contract.cost}` }}
    </option>
  </select>
</div>

      </div>

      <!-- Sección Proveedor -->
      <div v-if="activeSection === 'proveedor'" class="form-section">
        <h2>Datos del Proveedor</h2>

        <div class="form-group">
          <label>Nombre del proveedor:</label>
          <select v-model="form.providerId" @change="updateProveedorPhone" required>
            <option disabled value="">Seleccione un proveedor</option>
            <option v-for="prov in proveedores" :key="prov.id" :value="prov.id">
              {{ prov?.name ?? 'Nombre no disponible' }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Teléfono:</label>
          <input v-model="form.providerPhone" type="tel" readonly />
        </div>

        <button type="button" @click="toggleNuevoProveedor" class="add-provider-btn">
          {{ showNuevoProveedor ? 'Cerrar formulario de proveedor' : '+ Agregar Nuevo Proveedor' }}
        </button>
        <div class="form-section">
          <h2>Materiales / Items Requeridos</h2>
          <div class="materials-grid" :class="{ disabled: !form.providerId }">
            <template v-if="filteredItems && filteredItems.length">
              <div v-for="item in filteredItems" :key="item.id" class="material-item">
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

        <!-- Formulario para nuevo proveedor -->
        <div v-if="showNuevoProveedor" class="form-section nuevo-proveedor-section">
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
              <div class="material-inputs">
                <input v-model="nuevoMaterial.name" type="text" placeholder="Nombre del material" />
                <input v-model="nuevoMaterial.description" type="text" placeholder="Descripción" />
                <button type="button" @click="agregarMaterial">Agregar</button>
              </div>
              <ul class="material-list">
                <li
                  v-for="(mat, index) in nuevoProveedor.materials"
                  :key="index"
                  class="material-item-edit"
                >
                  <input v-model="mat.name" type="text" placeholder="Nombre" />
                  <input v-model="mat.description" type="text" placeholder="Descripción" />
                  <button type="button" @click="eliminarMaterial(index)">✕</button>
                </li>
              </ul>
            </div>
            <button type="submit" class="submit-btn">Agregar Proveedor</button>
          </form>
          
        </div>
      </div>

      <!-- Sección Detalles -->
      <div v-if="activeSection === 'detalles'" class="form-section">
        <h2>Detalles del Evento</h2>

        <div class="form-group">
          <label>Tipo de evento:</label>
          <select v-model="form.eventType" id="event" required>
            <option disabled value="">Seleccione un tipo</option>
            <option v-for="event in eventTypes" :key="event.id" :value="event.id">
              {{ event?.event ?? 'Tipo no disponible' }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Fecha de entrega del material:</label>
          <input v-model="form.eventDate" type="date" required :min="minDate" />
        </div>

        

        <div class="form-section">
          <h2>Detalles Adicionales</h2>
          <textarea
            v-model="form.notes"
            placeholder="Especificaciones especiales..."
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="cancel-btn">Cancelar</button>
          <button type="submit" class="submit-btn">Enviar Solicitud</button>
        </div>
      </div>
    </form>

    <div v-else-if="showForm" class="loading">
      Cargando datos para el formulario...
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
import contract from './contracts.js';
import { sendReminder } from './envioMensajeProveedor.js'; // ✅ Importa función para WhatsApp

export default {
  components: { Navbar },
  mixins: [logica2, proveedor, items, clients, contract],

  data() {
    return {
      showForm: false,
      showNuevoProveedor: false,  
      activeSection: 'cliente',
      loading: false,
      contracts: [],
      requests: [],
      contractId: '',
      eventTypes: [],
      proveedores: [], 
      clientes: [],
      itemQuantities: {},
      form: {
        clientId: '',
        contractId: '',
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
      nuevoProveedor: {
        name: '',
        phone: '',
        materials: []
      },
      nuevoMaterial: {
        name: '',
        description: ''
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
    },
    filteredContracts() {
      return this.contracts.filter(c => c.clientId === this.form.clientId);
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
    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) this.resetForm();
    },

    toggleNuevoProveedor() {
      this.showNuevoProveedor = !this.showNuevoProveedor;
    },

    async fetchInitialData() {
      try {
        const [eventsRes, itemsRes, clientsRes, proveedoresRes, contractsRes] = await Promise.all([
          fetch('http://localhost:3001/events').then(res => res.json()),
          fetch('http://localhost:3001/items').then(res => res.json()), 
          fetch('http://localhost:3001/clients').then(res => res.json()),
          fetch('http://localhost:3001/providers').then(res => res.json()),
          fetch('http://localhost:3001/contracts').then(res => res.json())
        ]);

        if (!proveedoresRes || !Array.isArray(proveedoresRes)) {
          throw new Error("No se pudieron cargar los proveedores.");
        }

        this.eventTypes = eventsRes;
        this.items = itemsRes;
        this.clientes = clientsRes;
        this.proveedores = proveedoresRes;
        this.contracts = contractsRes;

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
      this.showNuevoProveedor = false;
      this.showForm = false;
    },

    async agregarProveedor() {
      if (!this.nuevoProveedor.name || !this.nuevoProveedor.phone) {
        alert('Por favor completa el nombre y teléfono del proveedor.');
        return;
      }

      const materiales = this.nuevoProveedor.materials;
      const itemIds = [];

      for (const material of materiales) {
        const itemRes = await fetch('http://localhost:3001/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(material)
        });

        const item = await itemRes.json();
        itemIds.push(item.id);
      }

      const proveedorRes = await fetch('http://localhost:3001/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.nuevoProveedor.name,
          phone: this.nuevoProveedor.phone,
          itemsID: itemIds
        })
      });

      const nuevoProv = await proveedorRes.json();

      this.proveedores.push(nuevoProv);
      this.nuevoProveedor = { name: '', phone: '', materials: [] };
      this.showNuevoProveedor = false;

      alert('Proveedor agregado correctamente.');
      this.form.providerId = nuevoProv.id;
      this.updateProveedorPhone();
    },

    agregarMaterial() {
      if (!this.nuevoMaterial.name || !this.nuevoMaterial.description) {
        alert('Por favor completa nombre y descripción del material');
        return;
      }

      this.nuevoProveedor.materials.push({
        name: this.nuevoMaterial.name,
        description: this.nuevoMaterial.description
      });

      this.nuevoMaterial.name = '';
      this.nuevoMaterial.description = '';
    },

    eliminarMaterial(index) {
      this.nuevoProveedor.materials.splice(index, 1);
    },

    async submitRequest() {
      try {
        const selectedItems = this.form.selectedItems.map(id => {
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

        // Envío del correo
        await emailjs.send(
          'service_mue6u1e',
          'template_r2yiyww',
          emailParams,
          'HyMf4uLXj_anD5EEc'
        );

        // Construir mensaje de WhatsApp
        const whatsappMessage = `Hola ${selectedProvider?.name},\n\n` +
          `Se ha realizado una solicitud de material con los siguientes datos:\n` +
          `📅 Evento: ${this.getEventName(this.form.eventType)}\n` +
          `📍 Fecha de entrega: ${this.form.eventDate}\n` +
          `📞 Cliente: ${this.clientes.find(c => c.id === this.form.clientId)?.name} (${this.form.phone})\n` +
          `🧾 Materiales: ${selectedItems}\n` +
          `📝 Notas: ${this.form.notes || 'Ninguna'}\n`;

        const enviado = await sendReminder(this.form.providerPhone, whatsappMessage);

        if (enviado) {
          alert('Solicitud enviada por correo y WhatsApp');
        } else {
          alert('Correo enviado, pero falló el envío por WhatsApp');
        }

        this.resetForm();
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Ocurrió un error al enviar la solicitud');
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
  .add-provider-btn {
  margin: 10px 0;
  background-color: #2e86de;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.add-provider-btn:hover {
  background-color: #1b4f72;
}

.nuevo-proveedor-section {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f9f9f9;
}
  /* Estados */
  .loading, .empty-state {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  /** tab */
  .form-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.form-tabs button {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  background: #eee;
  border-radius: 5px;
}
.form-tabs button.active {
  background: #007bff;
  color: white;
}

  </style>