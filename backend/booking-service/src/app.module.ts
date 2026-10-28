import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { BookingController, PaymentController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({ controllers: [HealthController, BookingController, PaymentController], providers: [BookingService] })
export class AppModule {}
