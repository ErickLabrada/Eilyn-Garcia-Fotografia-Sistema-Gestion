<template>
  <div class="recordatorio-container">
    <Navbar :menus="menus" />
    <div class="recordatorio-form">
      <h2>Enviar Recordatorio</h2>
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
/* Solo estilos para el formulario de recordatorio */
.recordatorio-form {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  max-width: 400px;
  margin: 20px auto;
  background-color: #f9f9f9;
}

.recordatorio-form h2 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #1565c0;
}

.status {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
  color: green;
}
</style>