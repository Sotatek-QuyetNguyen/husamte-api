import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Matches, Max, MaxLength, Min, registerDecorator, ValidateNested, ValidationArguments, ValidationOptions } from "class-validator";
import { IsBiggerThanZero } from "src/share/common/base.dto";
import { FIELD_REQUIRED, REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT } from "src/share/common/constants";
import { order_by } from "src/share/dto/page-option-swagger.dto";
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
  @IsBiggerThanZero('userId', {
    message: 'Value must be higher than 0.',
  })
  @Type(() => Number)
  @IsInt({ message: 'Input can only contain number.' })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: "Percentage of user owned property, unit (%)",
    required: true,
    example: 30,
  })
  @IsBiggerThanZeroAndSmallerThan100('percentage', {
    message: 'percentage must be bigger than 0 and smaller than 100'
  })
  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, {
    message: 'percentage must be a number and have max 2 digits after decimal'
  })
  @IsNumberString()
  @IsNotEmpty()
  percentage: number;
}

export class CreatePropertyDTO {
  @ApiProperty({
    description: "Array of owners information"
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => ownerDTO)
  @IsArray()
  @IsNotEmpty()
  owners: ownerDTO[];
}

export class UpdatePropertyDTO {
  @ApiProperty({
    description: "Id of property",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero('id', {
    message: 'Value must be higher than 0.',
  })
  @Type(() => Number)
  @IsInt({ message: 'Input can only contain number.' })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: "Name of property",
    example: "EcoCity",
  })
  @MaxLength(100, { message: 'Maximum 100 characters.' })
  @IsString()
  @IsNotEmpty({ message: FIELD_REQUIRED })
  name: string;

  @ApiProperty({
    description: "Description",
    example: "Description",
  })
  @MaxLength(1000, { message: 'Maximum 1000 characters' })
  @IsString()
  @IsNotEmpty({ message: FIELD_REQUIRED })
  description: string;

  @ApiProperty({
    description: "Image url",
    example: "https://image.com",
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: "Type of property",
    example: 1,
  })
  @IsIn(Object.values(PROPERTY_TYPE))
  @IsInt()
  @IsNotEmpty()
  type: number;

  @ApiProperty({
    description: "Property's acreage, unit is ft",
    example: 120.5,
  })
  @IsNumber()
  @IsNotEmpty()
  acreage: number;

  @Max(20)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  bedroomCount: number;

  @Max(20)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  bathroomCount: number;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  parkingSlot: number;

  @IsIn(Object.values(AIR_CONDITIONING_TYPE))
  @IsNumber()
  @IsNotEmpty()
  airConditioningType: number;

  @IsIn(Object.values(PROPERTY_EXTERNAL))
  @IsNumber()
  @IsNotEmpty()
  external: number;

  @IsIn(Object.values(PROPERTY_BASEMENT))
  @IsNumber()
  @IsNotEmpty()
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

  @MaxLength(1000, { message: 'Maximum 1000 characters' })
  @IsString()
  @IsOptional()
  extras: string;

  @ApiProperty({
    description: "Room detail of property"
  })
  @Type(() => RoomDTO)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
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

  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, {
    message: 'Length must be a number and have max 2 digits after decimal'
  })
  @IsNumberString()
  @IsNotEmpty()
  length: number;

  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, {
    message: 'Width must be a number and have max 2 digits after decimal'
  })
  @IsNumberString()
  @IsNotEmpty()
  width: number;

  @IsCorrectRoomFeature('feature', {
    message: 'Room feature invalid'
  })
  @IsArray()
  @IsOptional()
  feature: number[];
}

export class GetOnePropertyDTO {
  @ApiProperty({
    description: "Id of property",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero('id', {
    message: 'Value must be higher than 0.',
  })
  @Type(() => Number)
  @IsInt({ message: 'Input can only contain number.' })
  @IsNotEmpty()
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
  @Min(0)
  @IsInt()
  @IsOptional()
  readonly page?: number = 0;

  @ApiPropertyOptional({
    minimum: 0,
    default: 9,
  })
  @Type(() => Number)
  @Min(0)
  @IsInt()
  @IsOptional()
  readonly size?: number = 9;

  @Type(() => Number)
  @IsIn(Object.values(PROPERTY_STATUS))
  @IsInt()
  @IsOptional()
  filterStatus: number

  @Type(() => String)
  @IsString()
  @IsOptional()
  search: string
}

export class DeleteOnePeropertyDTO extends GetOnePropertyDTO {}
