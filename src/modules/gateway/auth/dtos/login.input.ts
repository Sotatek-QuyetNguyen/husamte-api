import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginInput {
  @IsString()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'email',
  })
  @IsEmail()
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
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth: Date;
}

export class ForgotPassword {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordInput {
  @ApiProperty()
  @IsNotEmpty()
  public id!: number;

  @ApiProperty()
  @IsString()
  public code!: string;

  @ApiProperty()
  @IsString()
  public newPassword!: string;

  @ApiProperty()
  @IsString()
  public reNewPassword!: string;
}

