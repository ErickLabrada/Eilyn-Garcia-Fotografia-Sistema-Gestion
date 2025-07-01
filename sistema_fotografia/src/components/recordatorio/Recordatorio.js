import axios from 'axios';

export async function sendReminder() {
 

  try {
    await axios.post('http://localhost:3008/v1/notify', {
      number: "521"+this.phone,
      message: this.message
    });
    this.status = 'Recordatorio enviado con éxito';
  } catch (error) {
    console.error(error);
    this.status = 'Error al enviar recordatorio';
  }
}
