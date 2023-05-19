import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SearchUserDTO {
  @ApiProperty({
    required: true,
    example: 'email',
  })
  @MaxLength(100, { message: 'Input’s maximum length is 100 characters.' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class EditUserDTO {
  @ApiProperty()
  @IsStrongPassword(undefined, {
    message:
      'Password must have at least 8 characters with 1 uppercase, 1 lowercase letter, 1 number and 1 special character',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @ApiProperty()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  role: number;
}
