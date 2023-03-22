import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { CreateOrUpdateOwnerProfileDto } from './owner-profile.dto';

@Injectable()
export class OwnerProfileService extends BaseService {
  constructor(
    prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super(prismaService, 'ownerProfile', 'OwnerProfile', configService);
  }

  async createOrUpdateOwnerProfile(data: CreateOrUpdateOwnerProfileDto) {
    const assetId = data.assetId;
    const assetProfile = await this.prismaService.assetProfile.findFirst({ where: { id: assetId } });
    if (assetProfile) {
      if (assetProfile.ownerProfileId) {
        return await this.updateOwnerProfile(assetProfile.ownerProfileId, data);
      }
      return await this.createOwnerProfile(assetId, data);
    }
    throw new HttpException(`Cannot find asset with id ${assetId}`, HttpStatus.NOT_FOUND);
  }

  async updateOwnerProfile(id: number, data: any) {
    const resultUpdate = await this.update({}, id, data);
    return resultUpdate;
  }

  async createOwnerProfile(assetId: number, data: any) {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const ownerProfile = await transaction.ownerProfile.create({ data });
        await transaction.assetProfile.update({
          where: { id: assetId },
          data: { ownerProfileId: ownerProfile.id },
        });
        return ownerProfile;
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
