<template>
  <div class="recordatorio-container">
    <Navbar :menus="navMenus" />
    <div class="recordatorio-form">
      <h2>Enviar Recordatorio</h2>
      <form @submit.prevent="sendReminder">
        <div class="form-group">
          <label>Cliente:</label>
          <select v-model="selectedClient" class="form-select" @change="resetDeliveryInfo">
            <option :value="null" disabled>Seleccione el cliente</option>
            <option v-for="client in clients" :key="client.id" :value="client">
              {{ client.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Número de Teléfono:</label>
          <input type="text" :value="selectedClient ? selectedClient.phone : ''" readonly />
        </div>
        
        <div class="form-group">
          <label>Tipo de Notificación:</label>
          <select v-model="notificationType" class="form-select" @change="updateMessageTemplate">
            <option value="" disabled>Seleccione un tipo</option>
            <option value="payment">Cita pendiente de pago</option>
            <option value="upcoming">Cita próxima</option>
            <option value="delivery">Entrega de producto</option>
            <option value="custom">Mensaje personalizado</option>
          </select>
        </div>
        
        <!-- Sección específica para entregas -->
        <div v-if="notificationType === 'delivery'" class="delivery-section">
          <div class="form-group">
            <label>Fecha de Entrega:</label>
            <input type="date" v-model="deliveryDate" :min="today" />
          </div>
          
          <div class="form-group">
            <label>Tipo de Entrega:</label>
            <select v-model="deliveryType" class="form-select">
              <option value="Física">Física</option>
              <option value="Digital">Digital</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Detalles de Entrega:</label>
            <textarea v-model="deliveryDetails" placeholder="Instrucciones adicionales para la entrega"></textarea>
          </div>
        </div>
        
        <div class="form-group">
          <label>Mensaje:</label>
          <textarea v-model="message" placeholder="Ingrese el mensaje"></textarea>
        </div>
        
        <button type="submit">Enviar Recordatorio</button>
      </form>
      <div v-if="status" :class="['status', statusClass]">{{ status }}</div>
    </div>
  </div>
</template>

<script>
import Navbar from '../../components/navbar/NavegacionView.vue';
import { sendReminder, getClients, createDelivery } from './Recordatorio.js';

export default {
  components: { Navbar },
  data() {
    return {
      message: '',
      status: '',
      navMenus: [],
      clients: [],
      selectedClient: null,
      notificationType: '',
      statusClass: '',
      deliveryDate: '',
      deliveryType: 'Física',
      deliveryDetails: '',
      today: new Date().toISOString().split('T')[0]
    };
  },
  methods: {
    async sendReminder() {
      if (!this.selectedClient) {
        this.showStatus('Por favor seleccione un cliente', 'error');
        return;
      }
      
      if (this.notificationType === 'delivery' && !this.deliveryDate) {
        this.showStatus('Por favor seleccione una fecha de entrega', 'error');
        return;
      }
      
      if (!this.message.trim()) {
        this.showStatus('Por favor escriba un mensaje', 'error');
        return;
      }
      
      try {
        // Si es una entrega, creamos el registro primero
        if (this.notificationType === 'delivery') {
          await this.createDeliveryRecord();
        }
        
        // Enviamos el mensaje
        await sendReminder(this.selectedClient.phone, this.message);
        
        this.showStatus('Recordatorio enviado con éxito', 'success');
        this.resetForm();
      } catch (error) {
        this.showStatus('Error al enviar recordatorio: ' + (error.message || ''), 'error');
      }
    },
    
    async createDeliveryRecord() {
      if (!this.selectedClient || !this.selectedClient.contracts?.length) {
        throw new Error('El cliente no tiene contratos asociados');
      }
      
      // Tomamos el primer contrato activo
      const contractId = this.selectedClient.contracts[0].id;
      
      const deliveryData = {
        date: this.deliveryDate,
        deliveryType: this.deliveryType,
        details: this.deliveryDetails,
        contractId: contractId
      };
      
      await createDelivery(deliveryData);
    },
    
    showStatus(message, type) {
      this.status = message;
      this.statusClass = type;
      setTimeout(() => {
        this.status = '';
        this.statusClass = '';
      }, 5000);
    },
    
    resetForm() {
      this.message = '';
      this.notificationType = '';
      this.deliveryDate = '';
      this.deliveryType = 'Física';
      this.deliveryDetails = '';
    },
    
    resetDeliveryInfo() {
      this.deliveryDate = '';
      this.deliveryType = 'Física';
      this.deliveryDetails = '';
    },
    
    async loadClients() {
      try {
        this.clients = await getClients();
      } catch (error) {
        this.showStatus('Error al cargar clientes: ' + (error.message || ''), 'error');
      }
    },
    
    updateMessageTemplate() {
      if (!this.selectedClient || this.notificationType === 'custom') {
        return;
      }
      
      const clientName = this.selectedClient.name;
      
      switch(this.notificationType) {
        case 'payment':
          this.generateAppointmentMessage(clientName, 'payment');
          break;
          
        case 'upcoming':
          this.generateAppointmentMessage(clientName, 'upcoming');
          break;
          
        case 'delivery':
          this.generateDeliveryMessage(clientName);
          break;
          
        default:
          this.message = '';
      }
    },
    
    generateAppointmentMessage(clientName, type) {
      const appointment = this.getNextAppointment();
      
      if (!appointment) {
        this.message = `Hola ${clientName}, ` + 
          (type === 'payment' 
            ? 'tienes un pago pendiente para tu próxima cita.' 
            : 'te recordamos tu próxima cita.');
        return;
      }
      
      const dateObj = new Date(appointment.date);
      const dateStr = this.formatDate(dateObj);
      const timeStr = this.formatTime(dateObj);
      
      if (type === 'payment') {
        this.message = `Hola ${clientName}, recuerda que tienes un pago pendiente para tu cita del ${dateStr} a las ${timeStr} en ${appointment.place}.`;
      } else {
        this.message = `Hola ${clientName}, te recordamos que tu cita es el ${dateStr} a las ${timeStr} en ${appointment.place}.`;
      }
    },
    
    generateDeliveryMessage(clientName) {
      if (!this.deliveryDate) {
        this.message = `Hola ${clientName}, tenemos una entrega programada para ti. Por favor confirma la fecha.`;
        return;
      }
      
      const dateObj = new Date(this.deliveryDate);
      const dateStr = this.formatDate(dateObj);
      
      let deliveryInfo = `entrega ${this.deliveryType.toLowerCase()}`;
      if (this.deliveryDetails) {
        deliveryInfo += ` (${this.deliveryDetails})`;
      }
      
      this.message = `Hola ${clientName}, tu ${deliveryInfo} está programada para el ${dateStr}. ¿Necesitas ayuda con algo más?`;
    },
    
    formatDate(date) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-MX', options);
    },
    
    formatTime(date) {
      const options = { hour: '2-digit', minute: '2-digit' };
      return date.toLocaleTimeString('es-MX', options);
    },
    
    getNextAppointment() {
      if (!this.selectedClient?.contracts) return null;
      
      let allAppointments = [];
      this.selectedClient.contracts.forEach(contract => {
        if (contract.appointments && contract.appointments.length) {
          contract.appointments.forEach(app => {
            allAppointments.push(app);
          });
        }
      });
      
      const now = new Date();
      const futureAppointments = allAppointments
        .filter(app => new Date(app.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      return futureAppointments.length > 0 ? futureAppointments[0] : null;
    }
  },
  watch: {
    selectedClient() {
      if (this.selectedClient && this.notificationType) {
        this.updateMessageTemplate();
      }
    },
    deliveryDate() {
      if (this.notificationType === 'delivery' && this.selectedClient) {
        this.generateDeliveryMessage(this.selectedClient.name);
      }
    },
    deliveryType() {
      if (this.notificationType === 'delivery' && this.selectedClient) {
        this.generateDeliveryMessage(this.selectedClient.name);
      }
    },
    deliveryDetails() {
      if (this.notificationType === 'delivery' && this.selectedClient) {
        this.generateDeliveryMessage(this.selectedClient.name);
      }
    }
  },
  created() {
    this.loadClients();
  }
};
</script>

<style scoped src="./recordatorio.css"></style>