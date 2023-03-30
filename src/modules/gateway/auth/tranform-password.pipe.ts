import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { hash } from 'bcrypt';

@Injectable()
export class TransformPasswordPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log("0000000000", value);
    value.password = await hash(value.password, 12);
    console.log("0000000001", value);
    return value;
  }
}
