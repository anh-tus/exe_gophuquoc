import { Body, Controller, Get, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookings: BookingService) {}

  @Get()
  async list(@Headers('authorization') authorization?: string) {
    const customer = await this.bookings.customer(authorization);
    return this.bookings.list(customer.customerId);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    const customer = await this.bookings.customer(authorization);
    return this.bookings.get(id, customer.customerId);
  }

  @Post('instant')
  async createInstant(@Headers('authorization') authorization: string | undefined, @Headers('idempotency-key') key: string | undefined, @Body() body: unknown) {
    const customer = await this.bookings.customer(authorization);
    return this.bookings.createInstant(customer.customerId, key, body);
  }

  @Post('requests')
  async createRequest(@Headers('authorization') authorization: string | undefined, @Headers('idempotency-key') key: string | undefined, @Body() body: unknown) {
    const customer = await this.bookings.customer(authorization);
    return this.bookings.createRequest(customer.customerId, key, body);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    const customer = await this.bookings.customer(authorization);
    return this.bookings.cancel(id, customer.customerId);
  }

  @Post(':id/reviews')
  async review(@Param('id') id: string, @Headers('authorization') authorization: string | undefined, @Body() body: unknown) {
    const customer = await this.bookings.customer(authorization);
    return this.bookings.review(id, customer.customerId, body);
  }

  @Post(':id/sandbox-payment')
  async sandboxPayment(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    const customer = await this.bookings.customer(authorization);
    return this.bookings.sandboxPayment(id, customer.customerId);
  }

  @Post(':id/payment-proof')
  async submitProof(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    const customer = await this.bookings.customer(authorization);
    return this.bookings.submitProof(id, customer.customerId);
  }
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly bookings: BookingService) {}

  @Post('sepay-sandbox-ipn')
  @HttpCode(200)
  ipn(@Headers('x-secret-key') secret: string | undefined, @Body() body: unknown) {
    return this.bookings.sandboxIpn(secret, body);
  }
}
