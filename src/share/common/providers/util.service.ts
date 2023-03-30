/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TemplateParameter = any[];
interface NormalResponse {
  code: number;
  data: any;
  message: string;
  status: string;
}
@Injectable()
export class UtilService {
  public async comparePassword(
    password: string,
    oldPassword?: string,
  ): Promise<boolean> {
    try {
      if (password && oldPassword) {
        const passwordEqual: boolean = await bcrypt.compare(
          password,
          oldPassword,
        );
        return passwordEqual;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  public buildSuccessResponse(data: any): NormalResponse {
    return {
      code: 0,
      message: '',
      data,
      status: 'success',
    };
  }

  public buildCustomResponse(
    code: number,
    data: any,
    message: string,
  ): NormalResponse {
    return {
      code,
      message,
      data,
      status: code === 0 ? 'success' : 'fail',
    };
  }

  public gererateRandomCode(): string {
    return uuid().substring(0, 6);
  }

  public randomNumber(): number {
    const max = 999999;
    const min = 100000;
    return Math.floor(Math.random() * (max - min) + min);
  }
}
