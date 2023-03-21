import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OwnerProfileController } from './owner-profile.controller';
import { OwnerProfileService } from './owner-profile.service';

@Module({
  controllers: [OwnerProfileController],
  providers: [
    ConfigService,
    OwnerProfileService,
  ]
})
export class OwnerProfileModule {}
