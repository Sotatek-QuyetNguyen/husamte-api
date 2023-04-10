import { HttpException, HttpStatus } from '@nestjs/common';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
var FormData = require('form-data');
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */

export class FileService {
  private FILE_URL: string = 'http://localhost:8354';

  public async uploadBufferFile(
    files: Array<Express.Multer.File>,
    userId: string,
  ): Promise<any> {
    try {
      const form = new FormData();
      files.forEach((file: Express.Multer.File) => {
        form.append('file', file.buffer, file.originalname);
      });
      form.append('userId', userId);
      const res = await axios.post(
        `${this.FILE_URL}/api/v1/file/upload`,
        form,
        {
          headers: form.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );
      console.log('CERTIFICATE: ', res.data.data.links);
      return res.data.data.links;
    } catch (e: any) {
      if (
        e?.message?.includes('Request body larger than maxBodyLength limit')
      ) {
        throw new HttpException(
          'File upload is larger than 10Mb',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(e);
      return null;
    }
  }

  public async uploadByBuffer(buffer: any, userId: string): Promise<any> {
    try {
      const form = new FormData();
      console.log(buffer);
      form.append('file', buffer, 'random.jpg');
      form.append('userId', userId);
      const res = await axios.post(
        `${this.FILE_URL}/api/v1/file/upload`,
        form,
        {
          headers: form.getHeaders(),
        },
      );
      return res.data.data.links;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async uploadCertificate(buffer: any, userId: string): Promise<any> {
    try {
      const form = new FormData();
      form.append('file', Buffer.from(buffer), 'certificate.pdf');
      form.append('userId', userId);
      const res = await axios.post(
        `${this.FILE_URL}/api/v1/file/upload`,
        form,
        {
          headers: form.getHeaders(),
        },
      );
      return res.data.data.links;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async uploadStreamFile(stream: any, userId: string): Promise<any> {
    try {
      const form = new FormData();
      form.append('file', stream);
      form.append('userId', userId);
      const res = await axios.post(
        `${this.FILE_URL}/api/v1/file/upload`,
        form,
        {
          headers: form.getHeaders(),
        },
      );
      return res.data.data.links;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
