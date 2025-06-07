// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kawaii0733@gmail.com', // <-- reemplaza con tu correo
      pass: 'vbpx guqn ierc eevb', // <-- reemplaza con tu contraseña de aplicación
    },
  });

  async enviarCorreoSolicitud(solicitud: any) {
    const materialesTexto = solicitud.materials
      .map((m: any) => `${m.name} (x${m.quantity})`)
      .join(', ');

    const mailOptions = {
      from: '"Sistema de Solicitudes" <aracely.campa23325@potros.itson.edu.mx>',
      to: 'aracelyc0733@gmail.com', // <-- reemplaza con el correo del encargado
      subject: 'Nueva solicitud de material',
      text: `
Se ha recibido una nueva solicitud de materiales:

📌 Cliente: ${solicitud.clientName}
📞 Teléfono: ${solicitud.phone}
📅 Evento: ${solicitud.eventType}
📆 Fecha: ${solicitud.eventDate}
📦 Materiales: ${materialesTexto}
📝 Notas: ${solicitud.notes || 'Ninguna'}
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
