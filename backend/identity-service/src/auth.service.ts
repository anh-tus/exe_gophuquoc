import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { FirebaseTokenVerifier } from './firebase-token-verifier.service';
import * as jwt from 'jsonwebtoken';

type CustomerView = { customerId: string; displayName: string | null; preferredLocale: string };

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly firebase: FirebaseTokenVerifier) {}

  private secret(): string {
    const secret = process.env.IDENTITY_JWT_SECRET;
    if (!secret || Buffer.byteLength(secret, 'utf8') < 32) throw new ServiceUnavailableException('Authentication is not configured');
    return secret;
  }

  async createSession(idToken: unknown): Promise<{ accessToken: string; tokenType: 'Bearer'; expiresIn: number; customer: CustomerView }> {
    this.secret();
    if (typeof idToken !== 'string' || idToken.length < 20 || idToken.length > 8192) throw new UnauthorizedException('Invalid credentials');
    const verified = await this.firebase.verify(idToken);
    const identityKey = { provider: 'FIREBASE', subject: verified.uid };
    let identity;
    try {
      identity = await this.prisma.externalIdentity.upsert({
        where: { provider_subject: identityKey },
        update: {},
        create: {
          ...identityKey,
          customer: { create: { displayName: verified.name?.trim().slice(0, 80) || null } },
        },
        include: { customer: true },
      });
    } catch (error) {
      // A concurrent first sign-in may have inserted the same Firebase subject.
      if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 'P2002') throw error;
      identity = await this.prisma.externalIdentity.findUniqueOrThrow({
        where: { provider_subject: identityKey }, include: { customer: true },
      });
    }
    const customer = this.view(identity.customer);
    const expiresIn = 3600;
    const accessToken = jwt.sign({}, this.secret(), {
      algorithm: 'HS256', issuer: 'gopu-identity', audience: 'gopu-services', subject: customer.customerId, expiresIn,
    });
    return { accessToken, tokenType: 'Bearer', expiresIn, customer };
  }

  customerIdFromBearer(header: string | undefined): string {
    this.secret();
    const match = /^Bearer ([A-Za-z0-9._~-]+)$/.exec(header ?? '');
    if (!match) throw new UnauthorizedException('Invalid credentials');
    try {
      const decoded = jwt.verify(match[1], this.secret(), { algorithms: ['HS256'], issuer: 'gopu-identity', audience: 'gopu-services' });
      if (typeof decoded === 'string' || !decoded.sub || !/^[0-9a-f-]{36}$/i.test(decoded.sub)) throw new Error('Invalid subject');
      return decoded.sub;
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getCustomer(customerId: string): Promise<CustomerView> {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new UnauthorizedException('Invalid credentials');
    return this.view(customer);
  }

  async updateCustomer(customerId: string, update: { displayName?: string | null; preferredLocale?: 'vi' | 'en' }): Promise<CustomerView> {
    await this.getCustomer(customerId);
    const customer = await this.prisma.customer.update({ where: { id: customerId }, data: update });
    return this.view(customer);
  }

  private view(customer: { id: string; displayName: string | null; preferredLocale: string }): CustomerView {
    return { customerId: customer.id, displayName: customer.displayName, preferredLocale: customer.preferredLocale };
  }
}
