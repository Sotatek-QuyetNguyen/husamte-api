import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { EditUserDTO, SearchUserDTO } from './user.dto';
import { order_by } from 'src/share/dto/page-option-swagger.dto';
import { USER_ROLES } from 'src/share/common/constants';
import { Request } from 'express';
import { UtilService } from 'src/share/common/providers';

@Injectable()
export class UserService extends BaseService {
  constructor(
    prismaService: PrismaService,
    configService: ConfigService,
    private util: UtilService,
  ) {
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
    const orderBy: any = [{ email: order_by.asc }];
    return await this.prismaService.user.findMany({
      select: select,
      where: query,
      orderBy,
      skip: 0,
      take: 5,
    });
  }

  async editUser(
    user_id: number,
    payload: EditUserDTO,
    req: Request,
  ): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new HttpException(
        this.util.buildCustomResponse(9, null, 'User not found.'),
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.id === Number(req.user.userId)) {
      throw new HttpException(
        this.util.buildCustomResponse(10, null, 'Can not update yourself.'),
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      req.user &&
      !req.user.roles.includes(USER_ROLES.SUPPER_ADMIN) &&
      (payload.role === USER_ROLES.ADMIN ||
        payload.role === USER_ROLES.SUPPER_ADMIN)
    ) {
      throw new HttpException(
        this.util.buildCustomResponse(
          8,
          null,
          "You don't have permission to perform this action.",
        ),
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const newUserInfo = {
      role: payload.role,
      password: payload.password,
      name: null,
    };
    if (payload.role !== USER_ROLES.USER) {
      newUserInfo.name = payload.firstName + ' ' + payload.lastName;
    }

    await this.prismaService.user.update({
      where: {
        id: user_id,
      },
      data: {
        ...newUserInfo,
      },
    });
  }
}
