import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { CrawlerConfigService } from 'src/share/configs/config.service';
import { CreatePropertyDTO, ownerDTO, UpdatePropertyDTO } from './property.dto';
import { ROOM_TYPE } from './property.const';

@Injectable()
export class PropertyService extends BaseService {
  constructor(prismaService: PrismaService, configService: ConfigService,
    private crawlerConfigService: CrawlerConfigService) {
    super(prismaService, 'property', 'Property', configService);
  }

  async createProperty(data: CreatePropertyDTO, adminId: number): Promise<any> {
    await this.validateOwnersExist(data.owners);
    this.validatePercentage(data.owners);
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const property = await transaction.property.create({ data: { createdBy: adminId } });
        for (let owner of data.owners) {
          await this.createOwnerOfProperty(property.id, owner.userId, Number(owner.percentage), transaction);
        }
        return await transaction.property.findFirst({
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

  async createOwnerOfProperty(propertyId: number, userId: number, percentage: number, transaction: any) {
    return await transaction.ownerOfProperty.create({
      data: {
        propertyId,
        userId,
        percentage
      }
    });
  }

  async updateProperty(data: UpdatePropertyDTO) {
    this.validateRoomInformation(data);
    const property = this.prismaService.property.findFirst({ where: { id: data.id } });
    if (!property) {
      throw new HttpException(`Property with id: ${data.id} not found`, HttpStatus.BAD_REQUEST);
    }
    try {
      await this.prismaService.$transaction(async (transaction) => {
        await this.updatePropertyProfile(data, transaction);
        await this.createRooms(data.id, data.rooms, transaction);
      });
      return await this.getProperty(data.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePropertyProfile(data: UpdatePropertyDTO, transaction: any) {
    const id = data.id;
    let clonedData = Object.assign({}, data);
    delete clonedData.id;
    delete clonedData.rooms;
    await transaction.property.update({
      where: { id: id },
      data: clonedData
    });
  }

  async createRooms(propertyId: number, rooms: any, transaction: any) {
    // Remove all old room
    await transaction.room.deleteMany({ where: { propertyId } });

    rooms.map((room) => {
      room.propertyId = propertyId;
      room.length = Number(room.length);
      room.width = Number(room.width);
      room.feature = JSON.stringify(room.feature);
    });
    await transaction.room.createMany({ data: rooms});
  }

  async getProperty(id: number) {
    let property = await this.prismaService.property.findFirst({
      where: { id },
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
        room: true,
      }
    })
    if (property.room.length) {
      property.room.map((room) => {
        room.feature = JSON.parse(room.feature)
      });
    }
    return property;
  }

  validateRoomInformation(data: UpdatePropertyDTO) {
    if (data.bedroomCount &&
      data.bedroomCount !== data.rooms.filter((room) => { return room.type == ROOM_TYPE.BEDROOM }).length) {
      throw new HttpException(`Bedroom information need equal with bedroomCount`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (data.bathroomCount &&
      data.bathroomCount !== data.rooms.filter((room) => { return room.type == ROOM_TYPE.BATHROOM }).length) {
      throw new HttpException(`Bathroom information need equal with bedroomCount`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const otherRooms = Object.keys(data)
      .filter(key => key.includes('has'))
      .reduce((obj, key) => {
        obj[key.replace("has", "").toUpperCase()] = Number(data[key]);
        return obj;
      }, {});
    for (const roomName in otherRooms) {
      if (otherRooms[roomName] != data.rooms.filter((room) => { return room.type == ROOM_TYPE[roomName] }).length) {
        throw new HttpException(`${roomName} information missing or redundancy`, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }
}