import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CountryService } from "./country.service";
import { ResponseUtils } from "src/share/utils/response.utils";
import { JwtAuthGuard } from "../auth";
import { GetAllStateOfCountryDTO } from "./country.dto";

@Controller('country')
@ApiTags('Country')
export class CountryController {
  constructor(private readonly countryService: CountryService) { }

  @Get('/all')
  @ApiOperation({ summary: `Get all country` })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllCountry(): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.countryService.getAllCountry());
  }

  @Get('/state')
  @ApiOperation({ summary: `Get all state of country` })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllStateOfCountry(
    @Query() params: GetAllStateOfCountryDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.countryService.getAllStateOfCountry(params.id));
  }
}