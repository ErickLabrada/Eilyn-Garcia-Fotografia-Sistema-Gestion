import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App); // Crear instancia de la aplicación
app.use(router); // Usar el enrutador
app.mount('#app'); // Montar la aplicación
