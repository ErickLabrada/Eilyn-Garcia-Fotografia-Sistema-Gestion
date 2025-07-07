<template>
  <div class="admin-container">
    <Navbar :menus="menus" />

    <div class="admin-content">

      <!-- Título separado del formulario -->
      <div class="header-section">
        <h2 class="admin-title">Registrar Empleado</h2>
        <p class="subtext">Aquí puedes registrar un nuevo empleado para el sistema.</p>
      </div>

      <!-- Tarjeta con formulario -->
      <div class="admin-card">
        <form @submit.prevent="registrarEmpleado" class="employee-form">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              v-model="empleado.email"
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              v-model="empleado.password"
              id="password"
              type="password"
              placeholder="••••••••"
              class="form-input"
              required
            />
          </div>
          <button type="submit" class="submit-btn">
            <i class="bi bi-save"></i> Registrar empleado
          </button>
        </form>
      </div>

      <!-- Título separado para la tabla -->
      <div class="header-section">
        <h2 class="admin-title">Lista de Empleados</h2>
        <p class="subtext">Administración de cuentas registradas.</p>
      </div>

      <!-- Tarjeta con tabla -->
      <div class="admin-card">
        <div class="table-responsive">
          <table class="employee-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="empleado in empleados" :key="empleado.id">
                <td>{{ empleado.email }}</td>
                <td class="actions">
                  <button class="action-btn delete" @click="eliminarEmpleado(empleado.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>



<script>
import Navbar from '../../components/navbar/NavegacionView.vue';
import logica1 from '../../logic/paginaInicial.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase.js';

import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const functions = getFunctions();
const eliminarUsuario = httpsCallable(functions, 'eliminarUsuario');

export default {
  components: {
    Navbar
  },
  mixins: [logica1],
  data() {
    return {
      empleado: {
        email: '',
        password: ''
      },
      empleados: [],
      unsubscribe: null
    };
  },
  methods: {
    async registrarEmpleado() {
      try {
        const { email, password } = this.empleado;
        const credenciales = await createUserWithEmailAndPassword(auth, email, password);
        const uid = credenciales.user.uid;

        await setDoc(doc(db, 'empleados', uid), {
          email,
          creado: new Date()
        });

        alert('Empleado registrado correctamente');
        this.empleado = { email: '', password: '' };
      } catch (error) {
        console.error('Error registrando empleado:', error.message);
        alert('Error: ' + error.message);
      }
    },

    async eliminarEmpleado(uid) {
      const confirmar = confirm('¿Seguro que quieres eliminar este empleado?');
      if (!confirmar) return;

      try {
        const authInstance = getAuth();
        if (!authInstance.currentUser) {
          alert('Debes estar autenticado para eliminar usuarios');
          return;
        }

        const result = await eliminarUsuario({ uid });
        alert(result.data.message);
      } catch (error) {
        alert('Error: ' + error.message);
      }
    },

    escucharEmpleadosTiempoReal() {
      const empleadosRef = collection(db, 'empleados');
      this.unsubscribe = onSnapshot(empleadosRef, (snapshot) => {
        this.empleados = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      });
    }
  },

  mounted() {
    this.escucharEmpleadosTiempoReal();
  },

  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }
};
</script>


<style scoped>
.admin-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fb;
  padding: 2rem;
  color: #2c3e50;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
}

.admin-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ccc;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Formulario de registro */
.employee-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f8fafc;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

/* Botón de enviar */
.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover {
  background-color: #1a4f8b;
}

/* Tabla de empleados */
.table-responsive {
  overflow-x: auto;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.employee-table th,
.employee-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.employee-table th {
  background-color: #e9edf5;
  color: #333;
  text-transform: capitalize;
  font-size: 0.95rem;
}

.employee-table td {
  font-size: 0.95rem;
  color: #444;
}

.employee-table tr:hover {
  background-color: #f5f7fa;
}

/* Botones de acción */
.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Botón eliminar */
.action-btn.delete {
  background-color: #fbe9e7;
  color: #c62828;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.action-btn.delete:hover {
  background-color: #f2c7c3;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }

  .admin-card {
    padding: 1.5rem;
  }

  .employee-table {
    font-size: 0.85rem;
  }
}

</style>