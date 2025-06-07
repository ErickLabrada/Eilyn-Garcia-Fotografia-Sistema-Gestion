const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Configura el transporte SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tuCorreo@gmail.com',
    pass: 'tuContraseñaDeAplicación', // Usa contraseña de aplicación de Gmail
  },
});

app.post('/material-requests', async (req, res) => {
  const solicitud = req.body;

  try {
    // Guarda en base de datos (simulado aquí)
    // await db.insert(solicitud);

    const materialesTexto = solicitud.materials.map(m => `${m.name} (x${m.quantity})`).join(', ');

    const mailOptions = {
      from: '"Sistema de Solicitudes" <tuCorreo@gmail.com>',
      to: 'encargado@empresa.com',
      subject: 'Nueva solicitud de material',
      text: `Se ha registrado una nueva solicitud de materiales:\n\n${materialesTexto}\n\nSolicitado por: ${solicitud.requestedBy}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Solicitud registrada y correo enviado.' });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
});
fetch('/material-requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    requestedBy: 'Juan Pérez',
    materials: [
      { name: 'Papel', quantity: 10 },
      { name: 'Tinta', quantity: 2 }
    ]
  })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
