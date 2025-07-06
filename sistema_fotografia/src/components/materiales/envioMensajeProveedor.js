// src/components/materiales/envioMensajeProveedor.js
import axios from 'axios';

export async function sendReminder(phone, message) {
  try {
    await axios.post('http://localhost:3008/v1/notify', {
      number: "521" + phone,
      message: message
    });
    return true;
  } catch (error) {
    console.error("Error al enviar WhatsApp:", error);
    return false;
  }
}
