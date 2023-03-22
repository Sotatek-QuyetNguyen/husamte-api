import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/share/prisma/prisma.service";

@Injectable()
export class JwtVerifyRequestGuard implements CanActivate {
  constructor(private configService: ConfigService, private prismaService: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = (req.headers?.authorization || '').replace('Bearer', '').trim();
    if (!accessToken) {
      return false;
    }
    try {
      const decodeToken = jwt.verify(accessToken, this.configService.get<string>('JWT_KEY', 'husmatekey')) as any;
      const token = await this.prismaService.tokenOfUser.findUnique({
        where: { token: accessToken },
        include: { user: true },
      });
      if (!token)
        return false;
      if (decodeToken.id != token.userId)
        return false;
      req.app.set('token', token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
    return true;
  }
}