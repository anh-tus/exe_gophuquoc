import { BadRequestException, Body, Controller, Get, Headers, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { parseProfileInput } from './profile-input';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('session')
  createSession(@Body() body: unknown) {
    const idToken = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>).idToken : undefined;
    return this.auth.createSession(idToken);
  }

  @Get('me')
  async getMe(@Headers('authorization') authorization?: string) {
    return this.auth.getCustomer(this.auth.customerIdFromBearer(authorization));
  }

  @Patch('me')
  async updateMe(@Headers('authorization') authorization: string | undefined, @Body() body: unknown) {
    const customerId = this.auth.customerIdFromBearer(authorization);
    try {
      return await this.auth.updateCustomer(customerId, parseProfileInput(body));
    } catch (error) {
      if (error instanceof Error && ['Invalid profile', 'Invalid display name', 'Invalid locale', 'Empty profile update'].includes(error.message)) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
