import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma.service';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';

@Module({ controllers: [HealthController, SupplyController], providers: [PrismaService, SupplyService] })
export class AppModule {}
