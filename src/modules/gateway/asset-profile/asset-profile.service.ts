import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { UpdateAssetDTO } from './asset-profile.dto';

@Injectable()
export class AssetProfileService extends BaseService {
  constructor(prismaService: PrismaService, configService: ConfigService) {
    super(prismaService, 'assetProfile', 'AssetProfile', configService);
  }

  async update(data: UpdateAssetDTO, userId: number) {
    const assetProfile = await this.prismaService.assetProfile.findFirst({
      where: { id: data.assetId },
    });
    if (!assetProfile)
      throw new HttpException(
        `Cannot find asset with id ${data.assetId}`,
        HttpStatus.NOT_FOUND,
      );
    const asset = await this.prismaService.assetProfile.update({
      where: {
        id: data.assetId,
      },
      data: {
        assetName: data.assetName,
        description: data.description,
        sectorId: data.sectorId,
        categoryId: data.categoryId,
        stageId: data.stageId,
        rate: data.rate,
        userId: userId,
      },
    });
    return asset.id;
  }
}
