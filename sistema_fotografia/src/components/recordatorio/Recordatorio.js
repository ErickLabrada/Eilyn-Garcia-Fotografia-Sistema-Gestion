import axios from 'axios';

export async function sendReminder(phone, message) {
  try {
    await axios.post('http://localhost:3008/v1/notify', {
      number: phone,
      message: message
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function getClients() {
  try {
    const res = await axios.get('http://localhost:3001/clients/with-appointments');
    return res.data;
  } catch (error) {
    console.error("Error al obtener clientes con citas:", error);
    throw error;
  }
}