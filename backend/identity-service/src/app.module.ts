import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseTokenVerifier } from './firebase-token-verifier.service';
import { PrismaService } from './prisma.service';

@Module({ controllers: [HealthController, AuthController], providers: [AuthService, FirebaseTokenVerifier, PrismaService] })
export class AppModule {}
