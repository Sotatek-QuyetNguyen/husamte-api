import {
  Body,
  Get,
  Controller,
  Post,
  Param,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseJWTAuth } from 'src/modules/decorators/use.jwt.auth';
import { AssetProfileService } from './asset-profile.service';
import { Request } from 'express';
import { GetListAsset, UpdateAssetDTO } from './asset-profile.dto';

@ApiTags('asset-profile')
@Controller('asset-profile')
export class AssetProfileController {
  constructor(private readonly assetProfileService: AssetProfileService) {}

  @Post('/empty')
  @ApiOperation({ summary: `Create an empty asset` })
  @UseJWTAuth()
  @ApiBearerAuth()
  async listInvesterOfLoanId(@Req() req: Request): Promise<any> {
    const userId = req.app.get('token').userId;
    return await this.assetProfileService.create({
      userId,
    });
  }

  @Put('')
  @ApiOperation({ summary: `update-asset profile` })
  @UseJWTAuth()
  @ApiBearerAuth()
  updateAsset(@Req() req: Request, @Body() body: UpdateAssetDTO): Promise<any> {
    const userId = req.app.get('token').userId;
    return this.assetProfileService.update(body, userId);
  }

  @Get('/:id')
  @ApiOperation({ summary: `Get asset profile` })
  @UseJWTAuth()
  @ApiBearerAuth()
  async detail(@Req() req: Request, @Param('id') id: number): Promise<any> {
    return await this.assetProfileService.get(req, id);
  }

  @Get('/')
  @ApiOperation({ summary: `Get all asset-profile of user` })
  @UseJWTAuth()
  @ApiBearerAuth()
  async getAll(
    @Req() req: Request,
    @Query() getListAsset: GetListAsset,
  ): Promise<any> {
    req.query.userId = req.app.get('token').userId;
    return await this.assetProfileService.getAll(req, {
      include: {
        category: { select: { name: true } },
        stage: { select: { name: true } },
        sector: { select: { name: true } },
      },
    });
  }
}
