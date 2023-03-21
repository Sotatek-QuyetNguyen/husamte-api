import { Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseJWTAuth } from 'src/modules/decorators/use.jwt.auth';
import { AssetProfileService } from './asset-profile.service';
import { Request } from 'express';

@ApiTags('asset-profile')
@Controller('asset-profile')
export class AssetProfileController {
  constructor(
    private readonly assetProfileService: AssetProfileService,
  ) { }

  @Post('/empty')
  @ApiOperation({ summary: `Create an empty asset` })
  @UseJWTAuth()
  @ApiBearerAuth()
  async listInvesterOfLoanId(
    @Req() req: Request,
  ): Promise<any> {
    const userId = req.app.get('token').userId;
    return await this.assetProfileService.create({
      userId,
    });
  }
}
