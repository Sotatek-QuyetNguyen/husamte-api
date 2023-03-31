import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "src/share/common/decorators";
import { Payload } from "../auth";
import { AdminGuard } from "../auth/guards/admin.guard";
import { CreatePropertyDTO, UpdatePropertyDTO } from "./property.dto";
import { PropertyService } from "./property.service";

@Controller('property')
@ApiTags('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @Post()
  @ApiOperation({ summary: `Create property` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async create(
    @ReqUser() user: Payload,
    @Body() body: CreatePropertyDTO
  ): Promise<any> {
    return await this.propertyService.createProperty(body, Number(user.userId));
  }

  @Put()
  @ApiOperation({ summary: `Update property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async update(
    @Body() body: UpdatePropertyDTO
  ): Promise<any> {
    return await this.propertyService.updateProperty(body);
  }
}