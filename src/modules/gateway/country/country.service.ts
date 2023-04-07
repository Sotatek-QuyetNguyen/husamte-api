import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';

@Injectable()
export class CountryService extends BaseService {
  constructor(prismaService: PrismaService, configService: ConfigService) {
    super(prismaService, 'country', 'Country', configService);
  }

  async getAllCountry(): Promise<any> {
    return await this.prismaService.country.findMany();
  }

  async getAllStateOfCountry(id: number): Promise<any> {
    const country = await this.prismaService.country.findFirst({ where: { id } });
    if (!country) {
      throw new BadRequestException(`Country with id: ${id} not found`);
    }
    return await this.prismaService.state.findMany({ where: { countryId: id } });
  }
}