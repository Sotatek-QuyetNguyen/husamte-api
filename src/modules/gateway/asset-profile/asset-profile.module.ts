import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssetProfileController } from './asset-profile.controller';
import { AssetProfileService } from './asset-profile.service';

@Module({
  controllers: [AssetProfileController],
  providers: [
    ConfigService,
    AssetProfileService
  ],
})
export class AssetProfileModule {}
