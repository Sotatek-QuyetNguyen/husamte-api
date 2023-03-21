import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';

@Injectable()
export class AssetProfileService extends BaseService {
  constructor(
    prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super(prismaService, 'assetProfile', 'AssetProfile', configService);
  }
}
