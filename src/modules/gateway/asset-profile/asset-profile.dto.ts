import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PageOptionsSwagger } from 'src/share/dto/page-option-swagger.dto';

export class UpdateAssetDTO {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 5,
  })
  assetId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Input’s maximum length is 1000 characters.' })
  @ApiProperty({
    required: true,
    example: 'husmate',
  })
  assetName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1000, { message: 'Input’s maximum length is 1000 characters.' })
  @ApiProperty({
    required: true,
    example: 'husmate',
  })
  description: string;

  @IsInt({ message: 'Input can only contain whole numbers.' })
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    example: 1,
  })
  stageId: number;

  @IsInt({ message: 'Input can only contain whole numbers.' })
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    example: 1,
  })
  categoryId: number;

  @IsInt({ message: 'Input can only contain whole numbers.' })
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    example: 1,
  })
  sectorId: number;

  @IsInt({ message: 'Input can only contain whole numbers.' })
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 0,
  })
  rate: number;

  @IsInt({ message: 'Input can only contain whole numbers.' })
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 1,
  })
  stage: number;

  @IsInt({ message: 'Input can only contain whole numbers.' })
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 1,
  })
  category: number;

  @IsInt({ message: 'Input can only contain whole numbers.' })
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 1,
  })
  sector: number;
}

export class GetListAsset extends PageOptionsSwagger {
  @ApiPropertyOptional()
  @IsOptional()
  status: number;
}
