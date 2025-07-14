<template>
  <div class="recordatorio-container">
    <Navbar :menus="navMenus" />
    <div class="recordatorio-form">
      <h2>Enviar Recordatorio</h2>
      <form @submit.prevent="sendReminder">
        <div class="form-group">
          <label>Cliente:</label>
          <select v-model="selectedClient" class="form-select">
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
            <option value="custom">Mensaje personalizado</option>
          </select>
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
import { sendReminder, getClients } from './Recordatorio.js';

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
      statusClass: ''
    };
  },
  methods: {
    async sendReminder() {
      if (!this.selectedClient) {
        this.status = 'Por favor seleccione un cliente';
        this.statusClass = 'error';
        return;
      }
      
      if (!this.message.trim()) {
        this.status = 'Por favor escriba un mensaje';
        this.statusClass = 'error';
        return;
      }
      
      try {
        await sendReminder(this.selectedClient.phone, this.message);
        this.status = 'Recordatorio enviado con éxito';
        this.statusClass = 'success';
        this.message = '';
        this.notificationType = '';
      } catch (error) {
        this.status = 'Error al enviar recordatorio: ' + (error.message || '');
        this.statusClass = 'error';
      }
    },
    
    async loadClients() {
      try {
        this.clients = await getClients();
      } catch (error) {
        this.status = 'Error al cargar clientes: ' + (error.message || '');
        this.statusClass = 'error';
      }
    },
    
    updateMessageTemplate() {
      if (!this.selectedClient || this.notificationType === 'custom') {
        return;
      }
      
      const clientName = this.selectedClient.name;
      const appointment = this.getNextAppointment();
      
      if (!appointment) {
        this.message = `Hola ${clientName}, ` + 
          (this.notificationType === 'payment' 
            ? 'tienes un pago pendiente para tu próxima cita.' 
            : 'te recordamos tu próxima cita.');
        return;
      }
      
      const dateObj = new Date(appointment.date);
      const dateStr = dateObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      
      switch(this.notificationType) {
        case 'payment':
          this.message = `Hola ${clientName}, recuerda que tienes un pago pendiente para tu cita del ${dateStr} a las ${timeStr} en ${appointment.place}.`;
          break;
          
        case 'upcoming':
          this.message = `Hola ${clientName}, te recordamos que tu cita es el ${dateStr} a las ${timeStr} en ${appointment.place}.`;
          break;
          
        default:
          this.message = '';
      }
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
    }
  },
  created() {
    this.loadClients();
  }
};
</script>

<style scoped src="./recordatorio.css"></style>  