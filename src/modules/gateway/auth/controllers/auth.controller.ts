import { Controller, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { LoginInput, RegisterDto } from '../dtos/login.input';
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
}
