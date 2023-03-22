import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseJWTAuth } from 'src/modules/decorators/use.jwt.auth';
import { Request } from 'express';
import { OwnerProfileService } from './owner-profile.service';
import { CreateOrUpdateOwnerProfileDto } from './owner-profile.dto';

@ApiTags('owner-profile')
@Controller('owner-profile')
export class OwnerProfileController {
  constructor(
    private readonly ownerProfileService: OwnerProfileService,
  ) { }
  
  @Post()
  @ApiOperation({ summary: `Create or update owner profile` })
  @UseJWTAuth()
  @ApiBearerAuth()
  async listInvesterOfLoanId(
    @Body() body: CreateOrUpdateOwnerProfileDto,
  ): Promise<any> {
    return await this.ownerProfileService.createOrUpdateOwnerProfile(body);
  }

  @Get('/:id')
  @ApiOperation({ summary: `Get owner profile` })
  @UseJWTAuth()
  @ApiBearerAuth()
  async detail(@Req() req: Request, @Param('id') id: number): Promise<any> {
    return await this.ownerProfileService.get(req, id);
  }
}
