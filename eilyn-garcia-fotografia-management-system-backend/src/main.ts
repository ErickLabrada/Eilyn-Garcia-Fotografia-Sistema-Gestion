import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:8080', // Reemplaza con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si necesitas manejar cookies o tokens
  });

  await app.listen(3001);
  console.log('Servidor corriendo en http://localhost:3001');
}
bootstrap();
