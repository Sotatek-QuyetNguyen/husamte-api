import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "src/share/common/decorators";
import { Payload } from "../auth";
import { AdminGuard } from "../auth/guards/admin.guard";
import { CreatePropertyDTO, DeleteOnePeropertyDTO, GetListPropertyDTO, GetOnePropertyDTO, UpdatePropertyDTO } from "./property.dto";
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

  @Get()
  @ApiOperation({ summary: `Get property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async get(
    @Query() params: GetOnePropertyDTO
  ): Promise<any> {
    return await this.propertyService.getProperty(params.id);
  }

  @Get('/all')
  @ApiOperation({ summary: `Get list property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async getList(
    @Query() params: GetListPropertyDTO
  ): Promise<any> {
    return await this.propertyService.getListProperty(params);
  }

  @Delete()
  @ApiOperation({ summary: `Get list property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async delete(
    @Query() params: DeleteOnePeropertyDTO
  ): Promise<any> {
    return await this.propertyService.deleteProperty(params.id);
  }
}