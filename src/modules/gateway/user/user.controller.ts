import { Body, Controller, Get, Param, Post, Put, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { UseJWTAuth } from "src/modules/decorators/use.jwt.auth";
import { UserSignDTO } from "./user.dto";
import { UserService } from "./user.service";

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('me')
  @UseJWTAuth()
  @ApiOperation({ summary: `Get detail user` })
  @ApiBearerAuth()
  detail(@Req() req: Request): Promise<any> {
    return this.userService.get(req, req.app.get('token')?.user?.id);
  }

  @Post('/signin')
  @ApiOperation({ summary: `Sigin API` })
  login(@Body() body: UserSignDTO): Promise<any> {
    return this.userService.signin(body);
  }

  @Post('/signout')
  @UseJWTAuth()
  @ApiOperation({ summary: `Signout API` })
  @ApiBearerAuth()
  signout(@Req() req: Request): Promise<any> {
    return this.userService.signout(+req.app.get('token').id);
  }

}
