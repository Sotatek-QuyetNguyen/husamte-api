import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Matches, Max, MaxLength, Min, registerDecorator, ValidateNested, ValidationArguments, ValidationOptions } from "class-validator";
import { IsBiggerThanZero } from "src/share/common/base.dto";
import { FIELD_REQUIRED, REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT } from "src/share/common/constants";
import { order_by, PageOptionsSwagger } from "src/share/dto/page-option-swagger.dto";
import { AIR_CONDITIONING_TYPE, PROPERTY_BASEMENT, PROPERTY_EXTERNAL, PROPERTY_STATUS, PROPERTY_TYPE, ROOM_FEATURE, ROOM_TYPE } from "./property.const";

export function IsBiggerThanZeroAndSmallerThan100(
  property: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsBiggerThanZeroAndSmallerThan100',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value > 0 && value < 100;
        },
      },
    });
  };
}

export function IsCorrectRoomFeature(
  property: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCorrectRoomFeature',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          for (const num of value) {
            if (!Object.values(ROOM_FEATURE).includes(num)) {
              return false;
            }
          }
          return true;
        },
      },
    });
  };
}

export class ownerDTO {
  @ApiProperty({
    description: "Id of user is owner",
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt({ message: 'Input can only contain number.' })
  @IsBiggerThanZero('userId', {
    message: 'Value must be higher than 0.',
  })
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    description: "Percentage of user owned property, unit (%)",
    required: true,
    example: 30,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, {
    message: 'percentage must be a number and have max 2 digits after decimal'
  })
  @IsBiggerThanZeroAndSmallerThan100('percentage', {
    message: 'percentage must be bigger than 0 and smaller than 100'
  })
  percentage: number;
}

export class CreatePropertyDTO {
  @ApiProperty({
    description: "Array of owners information"
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => ownerDTO)
  @ValidateNested({ each: true })
  owners: ownerDTO[];
}

export class UpdatePropertyDTO {
  @ApiProperty({
    description: "Id of property",
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt({ message: 'Input can only contain number.' })
  @IsBiggerThanZero('id', {
    message: 'Value must be higher than 0.',
  })
  @Type(() => Number)
  id: number;

  @ApiProperty({
    description: "Name of property",
    example: "EcoCity",
  })
  @IsString()
  @IsNotEmpty({ message: FIELD_REQUIRED })
  @MaxLength(100, { message: 'Maximum 100 characters.' })
  name: string;

  @ApiProperty({
    description: "Description",
    example: "Description",
  })
  @IsString()
  @IsNotEmpty({ message: FIELD_REQUIRED })
  @MaxLength(1000, { message: 'Maximum 1000 characters' })
  description: string;

  @ApiProperty({
    description: "Image url",
    example: "https://image.com",
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: "Type of property",
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @IsIn(Object.values(PROPERTY_TYPE))
  type: number;

  @ApiProperty({
    description: "Property's acreage, unit is ft",
    example: 120.5,
  })
  @IsNotEmpty()
  @IsNumber()
  acreage: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(20)
  bedroomCount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(20)
  bathroomCount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  parkingSlot: number;

  @IsNumber()
  @IsNotEmpty()
  @IsIn(Object.values(AIR_CONDITIONING_TYPE))
  airConditioningType: number;

  @IsNumber()
  @IsNotEmpty()
  @IsIn(Object.values(PROPERTY_EXTERNAL))
  external: number;

  @IsNumber()
  @IsNotEmpty()
  @IsIn(Object.values(PROPERTY_BASEMENT))
  basement: number;

  @IsBoolean()
  @IsNotEmpty()
  hasKitchen: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasFoyer: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasBreakfast: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasLivingroom: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasDiningroom: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasFamilyroom: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasLaundry: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Maximum 1000 characters' })
  extras: string;

  @ApiProperty({
    description: "Room detail of property"
  })
  @IsOptional()
  @IsArray()
  @Type(() => RoomDTO)
  @ValidateNested({ each: true })
  rooms: RoomDTO[]
}

export class RoomDTO {
  @ApiProperty({
    description: "Type of room",
    example: ROOM_TYPE.BEDROOM,
  })
  @IsNumber()
  @IsNotEmpty()
  type: number;

  @IsNotEmpty()
  @IsNumberString()
  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, {
    message: 'Length must be a number and have max 2 digits after decimal'
  })
  length: number;

  @IsNotEmpty()
  @IsNumberString()
  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, {
    message: 'Width must be a number and have max 2 digits after decimal'
  })
  width: number;

  @IsArray()
  @IsOptional()
  @IsCorrectRoomFeature('feature', {
    message: 'Room feature invalid'
  })
  feature: number[];
}

export class GetOnePropertyDTO {
  @ApiProperty({
    description: "Id of property",
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt({ message: 'Input can only contain number.' })
  @IsBiggerThanZero('id', {
    message: 'Value must be higher than 0.',
  })
  @Type(() => Number)
  id: number;
}

export class GetListPropertyDTO {
  @ApiPropertyOptional({ enum: order_by, default: order_by.asc })
  @IsEnum(order_by)
  @IsOptional()
  readonly order_by?: order_by;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  readonly sort_by?: string;

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly page?: number = 0;

  @ApiPropertyOptional({
    minimum: 0,
    default: 9,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly size?: number = 9;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsIn(Object.values(PROPERTY_STATUS))
  filterStatus: number

  @Type(() => String)
  @IsOptional()
  @IsString()
  search: string
}

export class DeleteOnePeropertyDTO extends GetOnePropertyDTO {}
