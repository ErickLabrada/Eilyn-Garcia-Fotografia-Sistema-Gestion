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
import { auth } from '../../firebase/firebase.js'; 

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

    
        this.$router.push('/Inicio');
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
/* Fuente y reset de márgenes */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial Rounded MT Bold', sans-serif; /* Fuente especificada */
  background-color: #e0e0e0; /* Fondo gris muy claro */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

/* Estilo de contenedor principal */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ocupa toda la altura de la ventana */
  background-color: rgba(0, 0, 0, 0.1); /* Fondo sutil */
}

/* Marco del formulario */
.login-frame {
  background-color: #ffffff; /* Fondo blanco para el formulario */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  width: 100%;
  max-width: 400px; /* Maximo ancho para que no se expanda demasiado */
  text-align: center;
}

/* Estilo del título */
h2 {
  font-size: 1.8rem;
  color: #202020; /* Gris muy oscuro */
  margin-bottom: 0.5rem;
}

/* Estilo del párrafo */
p {
  font-size: 1rem;
  color: #404040; /* Gris oscuro */
  margin-bottom: 1.5rem;
}

/* Estilo de los grupos de inputs */
.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  font-size: 0.9rem;
  color: #404040; /* Gris oscuro para las etiquetas */
  display: block;
  margin-bottom: 0.3rem;
}

.input-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #b0b0b0; /* Borde gris claro */
  border-radius: 4px;
  font-size: 1rem;
  color: #202020; /* Gris muy oscuro */
  background-color: #fafafa; /* Fondo muy suave para los inputs */
}

.input-group input:focus {
  border-color: #707070; /* Borde gris medio cuando está enfocado */
  outline: none;
}

/* Botón de ingresar */
.login-button {
  width: 100%;
  padding: 1rem;
  background-color: #707070; /* Gris medio */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #404040; /* Gris más oscuro en hover */
}

/* Enlace de contraseña olvidada */
.forgot-password {
  font-size: 0.9rem;
  color: #707070; /* Gris medio */
  margin-top: 1rem;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Botón para restablecer contraseña */
.reset-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #b0b0b0; /* Gris claro */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.reset-button:hover {
  background-color: #888888; /* Gris más oscuro en hover */
}

</style>
