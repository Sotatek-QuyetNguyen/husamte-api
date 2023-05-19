import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { EditUserDTO, SearchUserDTO } from './user.dto';
import { UserService } from './user.service';
import { ResponseUtils } from 'src/share/utils/response.utils';
import { Request } from 'express';
import { TransformPasswordPipe } from '../auth/tranform-password.pipe';
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/search')
  @ApiOperation({ summary: `Search user by email` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async searchByEmail(@Query() query: SearchUserDTO): Promise<any> {
    return ResponseUtils.buildSuccessResponse(
      await this.userService.searchByEmail(query),
    );
  }

  @Put('/:id')
  @ApiOperation({ summary: `Edit user API` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async editUser(
    @Body(TransformPasswordPipe) body: EditUserDTO,
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<any> {
    await this.userService.editUser(+id, body, req);
    return ResponseUtils.buildSuccessResponse({});
  }
}
