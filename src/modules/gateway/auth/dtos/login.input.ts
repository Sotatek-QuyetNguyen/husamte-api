import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
  Max,
  Min,
} from 'class-validator';

export class LoginInput {
  @IsString()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'email',
  })
  @IsEmail(undefined, { message: 'Enter a valid email' })
  @IsNotEmpty({ message: 'Please enter email address' })
  public email!: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty({ message: 'Please enter password' })
  public password!: string;
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
  @IsEmail(undefined, { message: 'Enter a valid email' })
  @IsNotEmpty({ message: 'Please enter email address' })
  email: string;
}

export class ResetPasswordInput {
  @ApiProperty()
  @IsNotEmpty({ message: 'Id should not be empty' })
  @IsNumber()
  public id!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'OTP should not be empty' })
  public code!: string;

  @ApiProperty()
  @IsStrongPassword(undefined, {
    message:
      'Password must have at least 8 characters with 1 uppercase, 1 lowercase letter, 1 number and 1 special character',
  })
  @IsString()
  @IsNotEmpty({ message: 'Please enter password' })
  public newPassword!: string;

  @ApiProperty()
  // @IsStrongPassword(undefined, {
  //   message:
  //     'Password must have at least 8 characters with 1 uppercase, 1 lowercase letter, 1 number and 1 special character',
  // })
  @IsString()
  @IsNotEmpty({ message: 'Please confirm password' })
  public reNewPassword!: string;
}
