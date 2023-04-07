import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "src/share/common/decorators";
import { Payload } from "../auth";
import { AdminGuard } from "../auth/guards/admin.guard";
import { CreatePrimaryContactDTO, CreatePropertyDTO, DeleteOnePeropertyDTO, GetListPropertyDTO, GetOnePropertyDTO, GetPrimaryContactDTO, UpdateOwnerDTO, UpdatePrimaryContactDTO, UpdatePropertyDTO } from "./property.dto";
import { PropertyService } from "./property.service";
import { ResponseUtils } from "src/share/utils/response.utils";

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
    return ResponseUtils.buildSuccessResponse(await this.propertyService.createProperty(body, Number(user.userId)));
  }

  @Put()
  @ApiOperation({ summary: `Update property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async update(
    @Body() body: UpdatePropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.updateProperty(body));
  }

  @Get()
  @ApiOperation({ summary: `Get property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async get(
    @Query() params: GetOnePropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.getProperty(params.id));
  }

  @Get('/all')
  @ApiOperation({ summary: `Get list property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async getList(
    @Query() params: GetListPropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.getListProperty(params));
  }

  @Delete()
  @ApiOperation({ summary: `Delete property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async delete(
    @Query() params: DeleteOnePeropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.deleteProperty(params.id));
  }

  @Put('owner')
  @ApiOperation({ summary: `Update owner profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async updateOwner(
    @Body() body: UpdateOwnerDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.updateOwner(body));
  }

  @Get('primary-contact')
  @ApiOperation({ summary: `Get primary contact` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async getPrimaryContact(
    @Query() params: GetPrimaryContactDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.getPrimaryContact(params.id));
  }

  @Post('primary-contact')
  @ApiOperation({ summary: `Create primary contact for SPV` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async createPrimaryContact(
    @Body() body: CreatePrimaryContactDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.createPrimaryContact(body));
  }

  @Put('primary-contact')
  @ApiOperation({ summary: `Update primary contact` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async updatePrimaryContact(
    @Body() body: UpdatePrimaryContactDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.updatePrimaryContact(body));
  }
}