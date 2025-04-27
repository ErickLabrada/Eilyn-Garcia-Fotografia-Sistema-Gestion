<template>
  <div class="admin-container">
    <Navbar :menus="menus" />
    
    <div class="admin-content">
      <div class="admin-card">
        <h2 class="admin-title">
          <i class="bi bi-person-plus-fill"></i> Registrar empleado
        </h2>
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

      <div class="admin-card">
        <h2 class="admin-title">
          <i class="bi bi-people-fill"></i> Lista de empleados
        </h2>
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
                  <button class="action-btn edit">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="action-btn delete">
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
import { doc, setDoc, getDocs, collection } from 'firebase/firestore'; 
import { auth, db } from '../../firebase/firebase.js';

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
        const { email, password } = this.empleado;

        const credenciales = await createUserWithEmailAndPassword(auth, email, password);
        const uid = credenciales.user.uid;

        await setDoc(doc(db, 'empleados', uid), {
          email,
          creado: new Date()
        });

        alert('Empleado registrado correctamente');
        this.empleado = { email: '', password: '' };
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

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.admin-content {
  padding: 2rem;
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
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.75rem;
}

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
  transition: all 0.3s;
  background-color: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

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
  background-color: #2c5282;
}

.table-responsive {
  overflow-x: auto;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.employee-table th,
.employee-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.employee-table th {
  background-color: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.employee-table tr:hover {
  background-color: #f8fafc;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit {
  background-color: #e6fffa;
  color: #38b2ac;
}

.action-btn.edit:hover {
  background-color: #b2f5ea;
}

.action-btn.delete {
  background-color: #fff5f5;
  color: #f56565;
}

.action-btn.delete:hover {
  background-color: #fed7d7;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-content {
    padding: 1rem;
  }
  
  .admin-card {
    padding: 1.5rem;
  }
}
</style>