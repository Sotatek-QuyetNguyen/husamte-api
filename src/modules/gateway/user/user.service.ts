import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { SearchUserDTO } from './user.dto';
import { CrawlerConfigService } from 'src/share/configs/config.service';
import { order_by } from 'src/share/dto/page-option-swagger.dto';
import { USER_ROLES } from 'src/share/common/constants';

@Injectable()
export class UserService extends BaseService {
  constructor(prismaService: PrismaService, configService: ConfigService,
    private crawlerConfigService: CrawlerConfigService) {
    super(prismaService, 'user', 'User', configService);
  }

  async searchByEmail(params: SearchUserDTO): Promise<any> {
    const select: any = {
      id: true,
      email: true,
      name: true,
      dateOfBirth: true,
    };
    const query: any = {
      email: {
        contains: params.email,
      },
      role: USER_ROLES.USER,
      status: 1,
    };
    const orderBy: any = [{ email: order_by.asc }]
    return await this.prismaService.user.findMany({
      select: select,
      where: query,
      orderBy,
      skip: 0,
      take: 5
    });
  }
}