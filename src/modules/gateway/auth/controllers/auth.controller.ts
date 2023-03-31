import { Controller, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { Get, Post, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/share/common/decorators';
import { Payload } from '../auth.interface';
import { LoginInput, RegisterDto } from '../dtos/login.input';
import { JwtAuthGuard } from '../guards';
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('jwt/check')
  public jwtCheck(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }
}
