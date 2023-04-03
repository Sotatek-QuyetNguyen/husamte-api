/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { EMAIL_TYPE } from '../constants';

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

  public generateEmailContent(otp: string, type: number = 1): string {
    let title = '';
    let content = ``;
    console.log(otp);

    if (type === EMAIL_TYPE.RESET_PASSWORD) {
      content = ` <div class="container">
      <img src="./logo.svg" />
      <p class="hello">
          Hi there,
      </p>
      <p class="content">
          We had received a request to reset the password for your account.
          <br />
          You can use the following button to reset your password:
      </p>
      <button>
          <a href="${otp}">
              Reset your password
          </a>
      </button>
      <p>
          Button not working? Paste the following link into your browser:
          <a class="link__to"
              href="${otp}">${otp}</a>
      </p>
  </div>`;
    }
    console.log('cádfsd', content);

    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
        <title>Document</title>
        <style>
            body {
                margin: 0;
                font-family: 'Poppins'
            }
    
            .container {
                background-color:
                    #EDD8C6;
                padding: 14px 45px;
                width: 675px;
                border-radius: 20px;
                color: #2E2E2E;
                font-size: 14px;
            }
    
            img {
                width: 113px;
                height: 59px;
            }
    
            .hello {
                font-weight: 600;
                font-size: 18px;
            }
    
            button {
                background-color: #333333;
                box-shadow: 0px 8px 25px rgba(51, 51, 51, 0.35);
                border-radius: 10px;
                padding: 10px 22px;
            }
    
            button a {
                text-decoration: unset;
                font-weight:
                    700;
                color: white;
            }
    
            .link__to {
                color: #5487F5;
            }
        </style>
    </head>
    
    <body>
        ${content}
    </body>
    
    </html>`;
  }

  public async hash(text: string): Promise<string> {
    try {
      const saltOrRounds = 10;
      const hashed: string = await bcrypt.hash(text, saltOrRounds);
      return hashed;
    } catch (e) {
      return '';
    }
  }
}
