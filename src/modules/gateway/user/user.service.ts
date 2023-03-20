import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { SignKYCDTO, UserSignDTO } from './user.dto';
import { ethers } from 'ethers';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { User } from '@prisma/client';
import { CrawlerConfigService } from 'src/share/configs/config.service';

@Injectable()
export class UserService extends BaseService {
  constructor(prismaService: PrismaService, configService: ConfigService,
    private crawlerConfigService: CrawlerConfigService) {
    super(prismaService, 'user', 'User', configService);
  }

  async get(req: Request, id: any): Promise<any> {
    return super.get(req, id, {
      include: {
        proxies: true,
      }
    });
  }

  async signout(token: number): Promise<any> {
    return await this.prismaService.tokenOfUser.delete({ where: { id: token } });
  }

  async signin(data: UserSignDTO): Promise<any> {
    let address: string;
    try {
      address = ethers.utils.verifyMessage(`${this.configService.get<string>('APP_ID', 'husmate')}#${data.timestamp}`, data.sign);
    } catch (error) {
      // throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
      address = data.address;
    }
    if (address.toLowerCase() !== data.address.toLowerCase()) {
      throw new HttpException('sign.invalid', HttpStatus.BAD_REQUEST)
    }
    try {
      const user = await this.prismaService.user.upsert({
        where: { address: data.address.toLowerCase() },
        update: { address: data.address.toLowerCase() },
        create: { address: data.address.toLowerCase() },
      });

      const content = jwt.sign({ id: user.id, address: user.address }, this.configService.get<string>('JWT_KEY', 'husmatekey'), { expiresIn: this.configService.get<string>('JWT_EXPIRES', '1 day') })
      const token = await this.prismaService.tokenOfUser.create({
        include: {
          user: true,
        },
        data: {
          userId: user.id,
          token: content
        }
      })
      return token;
    } catch (error) {
      console.log('error at signin', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
