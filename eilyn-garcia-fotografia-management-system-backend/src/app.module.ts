import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // Import ConfigModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { RolesModule } from './roles/roles.module';
import { DeliveryTypesModule } from './delivery-types/delivery-types.module';
import { DeliveryController } from './delivery/delivery.controller';
import { DeliveryModule } from './delivery/delivery.module';
import { AppointmentTemplateModule } from './appointment-template/appointment-template.module';
import { BundleModule } from './bundle/bundle.module';
import { ClientsModule } from './clients/clients.module';
import { ProvidersModule } from './providers/providers.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ItemsModule } from './items/items.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Makes env variables available globally
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.HOST,
      port: Number(process.env.PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,  // Corrected here
      database: process.env.DATABASE_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true
    }),
    EmployeesModule,
    RolesModule,
    DeliveryTypesModule,
    DeliveryModule,
    AppointmentTemplateModule,
    BundleModule,
    ClientsModule,
    ProvidersModule,
    AppointmentModule,
    ItemsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
