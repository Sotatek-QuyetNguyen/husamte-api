import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { SearchUserDTO } from "./user.dto";
import { UserService } from "./user.service";

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/search')
  @ApiOperation({ summary: `Search user by email` })
  searchByEmail(
    @Query() query: SearchUserDTO
  ): Promise<any> {
    return this.userService.searchByEmail(query);
  }
}