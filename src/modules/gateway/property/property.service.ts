import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { CrawlerConfigService } from 'src/share/configs/config.service';
import { CreatePropertyDTO, ownerDTO } from './property.dto';

@Injectable()
export class PropertyService extends BaseService {
  constructor(prismaService: PrismaService, configService: ConfigService,
    private crawlerConfigService: CrawlerConfigService) {
    super(prismaService, 'property', 'Property', configService);
  }

  async createProperty(data: CreatePropertyDTO): Promise<any> {
    await this.validateOwnersExist(data.owners);
    await this.validatePercentage(data.owners);
    // Fake admin id
    const adminId = 5;
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const property = await this.prismaService.property.create({ data: { createdBy: adminId } });
        for (let owner of data.owners) {
          await this.createOwnerOfProperty(property.id, owner.userId, Number(owner.percentage));
        }
        return await this.prismaService.property.findFirst({
          where: {
            id: property.id
          },
          include: {
            owner: {
              select: {
                userId: true,
                percentage: true,
                user: {
                  select: {
                    email: true,
                    name: true,
                    dateOfBirth: true
                  }
                }
              }
            },
          }
        })
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async validateOwnersExist(owners: ownerDTO[]) {
    for(const owner of owners) {
      const user = await this.prismaService.user.findFirst({ where: { id: owner.userId } });
      if (!user) {
        throw new HttpException(`User id ${owner.userId} not exist!`, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }

  validatePercentage(owners: ownerDTO[]) {
    let sumPercentage = 0;
    for(const owner of owners) {
      sumPercentage += Number(owner.percentage);
    }
    if (sumPercentage != 100) {
      throw new HttpException(`Total percentage must be equal 100%`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async createOwnerOfProperty(propertyId: number, userId: number, percentage: number) {
    return await this.prismaService.ownerOfProperty.create({
      data: {
        propertyId,
        userId,
        percentage
      }
    });
  }
}