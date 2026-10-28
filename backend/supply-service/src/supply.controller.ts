import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { requireKey } from './access';
import { HoldInput, SupplyService } from './supply.service';

@Controller()
export class SupplyController {
  constructor(private readonly supply: SupplyService) {}

  @Get('listings')
  listings(@Query() query: Record<string, string | undefined>) { return this.supply.listings(query); }

  @Get('listings/:id')
  listing(@Param('id') id: string) { return this.supply.listing(id); }

  @Post('holds')
  createHold(@Headers('x-service-key') key: string | undefined, @Body() input: HoldInput) {
    requireKey(key, process.env.SUPPLY_SERVICE_KEY);
    return this.supply.createHold(input);
  }

  @Post('holds/:id/confirm')
  confirmHold(@Headers('x-service-key') key: string | undefined, @Param('id') id: string) {
    requireKey(key, process.env.SUPPLY_SERVICE_KEY);
    return this.supply.transitionHold(id, 'confirm');
  }

  @Post('holds/:id/release')
  releaseHold(@Headers('x-service-key') key: string | undefined, @Param('id') id: string) {
    requireKey(key, process.env.SUPPLY_SERVICE_KEY);
    return this.supply.transitionHold(id, 'release');
  }

  @Post('holds/:id/extend')
  extendHold(@Headers('x-service-key') key: string | undefined, @Param('id') id: string) {
    requireKey(key, process.env.SUPPLY_SERVICE_KEY);
    return this.supply.extendHold(id);
  }

  @Post('admin/listings')
  createListing(@Headers('x-admin-key') key: string | undefined, @Body() input: unknown) {
    requireKey(key, process.env.SUPPLY_ADMIN_KEY);
    return this.supply.createListing(input);
  }

  @Patch('admin/listings/:id')
  updateListing(@Headers('x-admin-key') key: string | undefined, @Param('id') id: string, @Body() input: unknown) {
    requireKey(key, process.env.SUPPLY_ADMIN_KEY);
    return this.supply.updateListing(id, input);
  }

  @Post('admin/listings/:id/offerings')
  createOffering(@Headers('x-admin-key') key: string | undefined, @Param('id') id: string, @Body() input: unknown) {
    requireKey(key, process.env.SUPPLY_ADMIN_KEY);
    return this.supply.createOffering(id, input);
  }

  @Post('admin/offerings/:id/slots')
  upsertSlot(@Headers('x-admin-key') key: string | undefined, @Param('id') id: string, @Body() input: unknown) {
    requireKey(key, process.env.SUPPLY_ADMIN_KEY);
    return this.supply.upsertSlot(id, input);
  }
}
