import { Module } from '@nestjs/common';
import { AssetProfileController } from './asset-profile.controller';
import { AssetProfileService } from './asset-profile.service';

@Module({
  controllers: [AssetProfileController],
  providers: [AssetProfileService]
})
export class AssetProfileModule {}
