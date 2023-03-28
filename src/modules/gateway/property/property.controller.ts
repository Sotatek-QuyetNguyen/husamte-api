import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreatePropertyDTO } from "./property.dto";
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
}