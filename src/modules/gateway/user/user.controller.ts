import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../auth/guards/admin.guard";
import { SearchUserDTO } from "./user.dto";
import { UserService } from "./user.service";
import { ResponseUtils } from "src/share/utils/response.utils";

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/search')
  @ApiOperation({ summary: `Search user by email` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async searchByEmail(
    @Query() query: SearchUserDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.userService.searchByEmail(query));
  }
}