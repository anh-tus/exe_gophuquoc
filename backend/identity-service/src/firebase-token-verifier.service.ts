import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseTokenVerifier {
  async verify(idToken: string): Promise<{ uid: string; name?: string }> {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) throw new ServiceUnavailableException('Authentication is not configured');
    try {
      const app = getApps().find((item) => item.name === 'gopu-identity') ?? initializeApp({ credential: applicationDefault(), projectId }, 'gopu-identity');
      const decoded = await getAuth(app).verifyIdToken(idToken, true);
      if (!decoded.uid || decoded.aud !== projectId) throw new UnauthorizedException('Invalid credentials');
      return { uid: decoded.uid, name: typeof decoded.name === 'string' ? decoded.name : undefined };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
