import axios from 'axios';

// Función para enviar recordatorios
export async function sendReminder(phone, message) {
  try {
    await axios.post('http://localhost:3008/v1/notify', {
      number:  phone,
      message: message
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

// Función para obtener clientes con citas activas
export async function getClients() {
  try {
    const res = await axios.get('http://localhost:3001/clients/with-appointments');
    return res.data;
  } catch (error) {
    console.error("Error al obtener clientes con citas:", error);
    throw error;
  }
}

// Función para crear una nueva entrega
export async function createDelivery(deliveryData) {
  try {
    const response = await axios.post('http://localhost:3001/delivery', {
      date: deliveryData.date,
      deliveryType: deliveryData.deliveryType,
      details: deliveryData.details,
      contractId: deliveryData.contractId
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear entrega:", error.response?.data || error.message);
    throw new Error('Error al crear el registro de entrega');
  }
}