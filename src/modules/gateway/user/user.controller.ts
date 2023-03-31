import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { AdminGuard } from "../auth/guards/admin.guard";
import { SearchUserDTO } from "./user.dto";
import { UserService } from "./user.service";

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/search')
  @ApiOperation({ summary: `Search user by email` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  searchByEmail(
    @Query() query: SearchUserDTO
  ): Promise<any> {
    return this.userService.searchByEmail(query);
  }
}