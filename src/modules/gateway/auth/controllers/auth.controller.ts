import { Controller, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { Get, Post, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/share/common/decorators';
import { Payload } from '../auth.interface';
import {
  ForgotPassword,
  LoginInput,
  RegisterDto,
  ResetPasswordInput,
} from '../dtos/login.input';
import { JwtAuthGuard } from '../guards';
import { AdminGuard } from '../guards/admin.guard';
import { AuthService } from '../providers';
import { TransformPasswordPipe } from '../tranform-password.pipe';

/**
 * https://docs.nestjs.com/techniques/authentication
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  /* Sign in account
  @Param: LoginInput
  @Return: success
  */
  @Post('sign-in')
  public async signIn(@Body() body: LoginInput): Promise<any> {
    return this.auth.signIn(body);
  }

  @UsePipes(ValidationPipe, TransformPasswordPipe)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.auth.register(dto);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('jwt/check')
  public jwtCheck(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }

  /* reset password
  @Param: ResetPasswordInput
  @Return: success
  */
  @ApiBearerAuth()
  @Post('reset-password')
  public async resetPassword(
    @Body() resetPassDto: ResetPasswordInput,
  ): Promise<any> {
    return this.auth.resetPassword(resetPassDto);
  }

  /* request new password by email
  @Param: email
  @Return: success
  */
  @ApiBearerAuth()
  @Post('forgot-password')
  public async getCodeForgotPassword(
    @Body() forgotPassword: ForgotPassword,
  ): Promise<any> {
    return this.auth.getCodeForgotPassword(forgotPassword);
  }
}
