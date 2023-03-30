import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInput {
  @IsString()
  @ApiProperty()
  public email!: string;

  @IsString()
  @ApiProperty()
  public password!: string;

  @Optional()
  public admin?: boolean;
}

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth: Date;
}
