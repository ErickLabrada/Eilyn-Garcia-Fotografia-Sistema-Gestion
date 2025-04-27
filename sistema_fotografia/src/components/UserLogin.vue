<template>
  <div class="login-container">
    <div class="login-frame">
      <h2>Bienvenido</h2>
      <p>Inicia sesión para usar el sistema</p>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="email">Correo electrónico:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="login-button">Ingresar</button>
        <p class="forgot-password">¿Olvidaste tu contraseña?</p>
        <button type="button" class="reset-button" @click="resetPassword">Restablecer</button>
      </form>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase.js'; 

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        console.log('Inicio de sesión exitoso:', user.email);

    
        this.$router.push('/paginaInicial');
      } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        alert('Correo o contraseña incorrectos');
      }
    },
    resetPassword() {
      alert('Favor de contactar al administrador del negocio para obtener una nueva contraseña.');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-frame {
  background-color: #d8d8d8;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 800px;
}

h2 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-button,
.reset-button {
  background-color: #4a4a4a;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
}

.forgot-password {
  margin-top: 15px;
  font-size: 14px;
  color: #555;
}

button:focus {
  outline: none;
}

button:hover {
  background-color: #5a5a5a;
}
</style>
