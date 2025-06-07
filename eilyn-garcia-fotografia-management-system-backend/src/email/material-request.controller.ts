import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Controller('material-requests')
export class MaterialRequestController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async crearSolicitud(@Body() solicitud: any) {
    try {
      // Puedes guardar en BD si lo deseas

      await this.emailService.enviarCorreoSolicitud(solicitud);

      return { message: 'Solicitud enviada y correo notificado' };
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      return { error: 'No se pudo procesar la solicitud' };
    }
  }

  // Ruta para probar que el controlador responde (opcional)
  @Get()
  prueba() {
    return { mensaje: 'Ruta GET activa' };
  }
}
