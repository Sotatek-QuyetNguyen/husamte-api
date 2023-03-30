import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreatePropertyDTO, UpdatePropertyDTO } from "./property.dto";
import { PropertyService } from "./property.service";


@Controller('property')
@ApiTags('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @Post()
  @ApiOperation({ summary: `Create property` })
  async create(
    @Body() body: CreatePropertyDTO
  ): Promise<any> {
    return await this.propertyService.createProperty(body);
  }

  @Put()
  @ApiOperation({ summary: `Update property profile` })
  async update(
    @Body() body: UpdatePropertyDTO
  ): Promise<any> {
    return await this.propertyService.updateProperty(body);
  }
}