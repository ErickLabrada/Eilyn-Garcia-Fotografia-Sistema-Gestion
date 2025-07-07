<template>
  <div class="recordatorio-container">
    <Navbar :menus="menus" />
    <main class="contenido-principal">
  <div class="header-section">
    <h1>Enviar Recordatorio</h1>
    <p class="subtext">Aquí podrás enviar mensajes recordatorios a los clientes.</p>
  </div>
  <div class="form-wrapper">
    <div class="recordatorio-form">
      <form @submit.prevent="sendReminder">
        <div class="form-group">
          <label for="phone">Número de Teléfono:</label>
          <input type="text" id="phone" v-model="phone" placeholder="Ingrese el número" />
        </div>
        <div class="form-group">
          <label for="message">Mensaje:</label>
          <textarea id="message" v-model="message" placeholder="Ingrese el mensaje"></textarea>
        </div>
        <button type="submit">Enviar Recordatorio</button>
      </form>
      <div v-if="status" class="status">{{ status }}</div>
    </div>
  </div>

</main>
  </div>
</template>


<script>
import Navbar from '../../components/navbar/NavegacionView.vue';
import { sendReminder } from './Recordatorio.js';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      phone: '',
      message: '',
      status: '',
      menus: []
    };
  },
  methods: {
    sendReminder
  }
};
</script>

<style scoped>
.recordatorio-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fb;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;

  
}
.contenido-principal {
  flex: 1;
  display: block;
  justify-content: center;
  padding: 2rem;
   align-items: center;
  justify-content: center;
}

.recordatorio-form {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  align-items: center;
  justify-content: center;
}

.recordatorio-form h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: #fdfdfd;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #1976d2;
  outline: none;
}

button[type="submit"] {
  width: 100%;
  padding: 0.75rem;
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #1a4f8b;
}

.status {
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  color: #388e3c;
  font-size: 0.95rem;
}
.header-section {
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
}

.header-section h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.header-section .subtext {
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
}

.form-wrapper {
  display: flex;
  justify-content: center;
}
.form-wrapper {
  display: flex;
  justify-content: center;
}

</style>