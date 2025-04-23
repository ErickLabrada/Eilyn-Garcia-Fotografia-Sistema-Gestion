<template>
    <Navbar :menus="menus" />
    
  <h2>
    Registrar empleado
  </h2>
  <h3>
    
  </h3>
    <form @submit.prevent="registrarEmpleado">
      <input v-model="empleado.email" placeholder="Correo" />
      <input v-model="empleado.password" placeholder="Contraseña" type="password" />
      <button type="submit">Registrar</button>
    </form>
    <h2>Lista de empleados</h2>
<table border="1">
  <thead>
    <tr>
      <th>Email</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="empleado in empleados" :key="empleado.id">
      
      <td>{{ empleado.email }}</td>
    </tr>
  </tbody>
</table>
  </template>
  
  <script>
import Navbar from '../components/HeaderComponent.vue';
import logica1 from '../logic/paginaInicial.js';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore'; 
import { auth, db } from '../firebase/firebase.js';

export default {
  components: {
    Navbar,
  },
  mixins: [logica1],
  data() {
    return {
      empleado: {
        
        email: '',
        password: '',
      },
      empleados: []
    };
  },
  methods: {
    async registrarEmpleado() {
      try {
        const {  email, password } = this.empleado;

        const credenciales = await createUserWithEmailAndPassword(auth, email, password);
        const uid = credenciales.user.uid;

        await setDoc(doc(db, 'empleados', uid), {
          
          email,
          creado: new Date()
        });

        alert('Empleado registrado correctamente');
        this.empleado = {  email: '', password: '' };

        
        this.cargarEmpleados();

      } catch (error) {
        console.error('Error registrando empleado:', error.message);
        alert('Error: ' + error.message);
      }
    },
    async cargarEmpleados() {
      try {
        const querySnapshot = await getDocs(collection(db, 'empleados'));
        this.empleados = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error cargando empleados:', error.message);
      }
    }
  },
  mounted() {
    this.cargarEmpleados();
  }
};
</script>
  
  <style>

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 10;
  padding: 0;
}


form {
  background-color: white;
  padding: 20px; 
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 60%; 
  max-width: 600px; 
  margin-left: auto; 
  margin-right: auto; 
}

form input {
  width: 80%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fafafa;
  font-size: 16px;

}

form button {
  width: 80%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

form button:hover {
  background-color: #218838;
}


h2 {
  text-align: center;
  margin-top: 30px;
  font-size: 24px;
  color: #333;
}

table {
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
}

table th,
table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

table th {
  background-color: #f9f9f9;
  color: #333;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}

table tr:hover {
  background-color: #e9e9e9;
}

</style>
  