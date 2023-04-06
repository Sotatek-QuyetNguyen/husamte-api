import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { CrawlerConfigService } from 'src/share/configs/config.service';
import { CreatePropertyDTO, GetListPropertyDTO, ownerDTO, UpdateOwnerDTO, UpdatePropertyDTO } from './property.dto';
import { PROPERTY_STATUS, ROOM_TYPE } from './property.const';
import { order_by } from 'src/share/dto/page-option-swagger.dto';
import { USER_ROLES } from 'src/share/common/constants';

@Injectable()
export class PropertyService extends BaseService {
  constructor(prismaService: PrismaService, configService: ConfigService,
    private crawlerConfigService: CrawlerConfigService) {
    super(prismaService, 'property', 'Property', configService);
  }

  async createProperty(data: CreatePropertyDTO, adminId: number): Promise<any> {
    await this.validateOwners(data.owners);
    this.validatePercentage(data.owners);
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const property = await transaction.property.create({ data: { createdBy: adminId } });
        for (let owner of data.owners) {
          await this.createOwnerOfProperty(property.id, owner.userId, Number(owner.percentage), transaction);
        }
        return await this.getProperty(property.id, transaction);
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async validateOwners(owners: ownerDTO[]) {
    const ownerIdArr = owners.map((owner) => { return owner.userId });
    if (ownerIdArr.length !== ownerIdArr.filter((value, index, array) => array.indexOf(value) === index).length) {
      throw new BadRequestException("2 owners should not be duplicated");
    }

    for(const owner of owners) {
      const user = await this.prismaService.user.findFirst({ where: { id: owner.userId, role: USER_ROLES.USER } });
      if (!user) {
        throw new BadRequestException(`User id ${owner.userId} not exist!`);
      }
    }
  }

  validatePercentage(owners: ownerDTO[]) {
    let sumPercentage = 0;
    for(const owner of owners) {
      sumPercentage += Number(owner.percentage);
    }
    if (sumPercentage != 100) {
      throw new BadRequestException(`Total percentage must be equal 100%`);
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
    const property = await this.prismaService.property.findFirst({ where: { id: data.id } });
    if (!property) {
      throw new BadRequestException(`Property with id: ${data.id} not found`);
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

  async getProperty(id: number, transaction: any = undefined) {
    let include = this.getPropertyIncludeQuery();
    let property: any;
    let query = {
      where: {
        id,
        NOT: {
          status: PROPERTY_STATUS.DELETED 
        }
      },
      include: include,
    };
    if (transaction !== undefined) {
      property = await transaction.property.findFirst(query);
    } else {
      property = await this.prismaService.property.findFirst(query);
    }
    if (property?.room !== undefined && property?.room.length) {
      property.room.map((room: any) => {
        room.feature = JSON.parse(room.feature)
      });
    }
    if (property) {
      return property;
    }
    throw new BadRequestException(`Property with id: ${id} not found`);
  }

  getPropertyIncludeQuery() {
    return {
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
    };
  }

  validateRoomInformation(data: UpdatePropertyDTO) {
    if (data.bedroomCount &&
      data.bedroomCount !== data.rooms.filter((room) => { return room.type == ROOM_TYPE.BEDROOM }).length) {
      throw new BadRequestException(`Bedroom information need equal with bedroomCount`);
    }
    if (data.bathroomCount &&
      data.bathroomCount !== data.rooms.filter((room) => { return room.type == ROOM_TYPE.BATHROOM }).length) {
      throw new BadRequestException(`Bathroom information need equal with bedroomCount`);
    }
    const otherRooms = Object.keys(data)
      .filter(key => key.includes('has'))
      .reduce((obj, key) => {
        obj[key.replace("has", "").toUpperCase()] = Number(data[key]);
        return obj;
      }, {});
    for (const roomName in otherRooms) {
      if (otherRooms[roomName] != data.rooms.filter((room) => { return room.type == ROOM_TYPE[roomName] }).length) {
        throw new BadRequestException(`${roomName} information missing or redundancy`);
      }
    }
  }

  async getListProperty(params: GetListPropertyDTO) {
    let where = {
      NOT: {
        status: PROPERTY_STATUS.DELETED 
      }
    };
    let orderBy = {};
    if (params.filterStatus != undefined) {
      where['status'] = params.filterStatus;
    }
    if (params.search != undefined) {
      where['OR'] = [
        {
          name: { contains: params.search },
        },
        {
          description: { contains: params.search }
        },
      ];
    }
    if (params.order_by != undefined && params.sort_by != undefined) {
      orderBy[`${params.sort_by}`] = params.order_by;
    } else {
      orderBy['id'] = order_by.desc;
    }
    const take = params.size;
    const skip = Math.max(Math.max(params.page - 1, 0) * take, 0);
    const result = await this.prismaService.property.findMany({
      where,
      include: this.getPropertyIncludeQuery(),
      orderBy,
      skip,
      take,
    })
    const meta = await this.buildMetaData(take, where);
    return { meta, data: result };
  }

  async deleteProperty(id: number) {
    try {
      await this.prismaService.property.update({
        where: { id },
        data: { status: PROPERTY_STATUS.DELETED }
      });
      return { result: "Delete property success" };
    } catch (e) {
      console.log(e);
      throw new HttpException(`Property delete failure`, HttpStatus.BAD_REQUEST);
    }
  }

  async updateOwner(data: UpdateOwnerDTO): Promise<any> {
    await this.validateOwners(data.owners);
    this.validatePercentage(data.owners);
    const property = await this.prismaService.property.findFirst({ where: { id: data.id } });
    if (!property) {
      throw new BadRequestException(`Property with id ${data.id} not found`);
    }
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        await transaction.ownerOfProperty.deleteMany({ where: { propertyId: property.id } });
        for (let owner of data.owners) {
          await this.createOwnerOfProperty(property.id, owner.userId, Number(owner.percentage), transaction);
        }
        return await this.getProperty(property.id, transaction);
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
