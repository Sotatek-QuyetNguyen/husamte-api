import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEmail, IsEnum, IsIn, IsInt, IsNumber, IsNumberString, IsOptional, IsString, Matches, Max, MaxLength, Min, registerDecorator, ValidateNested, ValidationArguments, ValidationOptions } from "class-validator";
import { IsBiggerThanZero, IsIntCustom, IsSmallerThan100, RequiredField } from "src/share/common/base.dto";
import { MAXIMUM_LENGTH, REGEX_INTERNATIONAL_PHONE_NUMBER, REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT } from "src/share/common/constants";
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
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
  userId: number;

  @ApiProperty({
    description: "Percentage of user owned property, unit (%)",
    required: true,
    example: 30,
  })
  @IsBiggerThanZero()
  @IsSmallerThan100()
  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, {
    message: 'Invalid owner percentage format'
  })
  @IsNumberString({}, { message: "Invalid owner percentage format" })
  @RequiredField()
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
  @RequiredField()
  owners: ownerDTO[];
}

export class UpdateOwnerDTO extends CreatePropertyDTO {
  @ApiProperty({
    description: "Id of property",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
  id: number;
}

export class UpdatePropertyDTO {
  @ApiProperty({
    description: "Id of property",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
  id: number;

  @ApiProperty({
    description: "Name of property",
    example: "EcoCity",
  })
  @MaxLength(100, { message: MAXIMUM_LENGTH(100) })
  @IsString()
  @RequiredField()
  name: string;

  @ApiProperty({
    description: "Description",
    example: "Description",
  })
  @MaxLength(1000, { message: MAXIMUM_LENGTH(1000) })
  @IsString()
  @RequiredField()
  description: string;

  @ApiProperty({
    description: "Image url",
    example: "https://image.com",
  })
  @IsString()
  @RequiredField()
  image: string;

  @ApiProperty({
    description: "Type of property",
    example: 1,
  })
  @IsIn(Object.values(PROPERTY_TYPE))
  @IsIntCustom()
  @RequiredField()
  type: number;

  @ApiProperty({
    description: "Property's acreage, unit is ft",
    example: 120.5,
  })
  @MaxLength(100, { message: MAXIMUM_LENGTH(100) })
  @IsString()
  @RequiredField()
  acreage: string;

  @Max(20)
  @Min(0)
  @IsNumber()
  @RequiredField()
  bedroomCount: number;

  @Max(20)
  @Min(0)
  @IsNumber()
  @RequiredField()
  bathroomCount: number;

  @Min(0)
  @IsNumber()
  @RequiredField()
  parkingSlot: number;

  @IsIn(Object.values(AIR_CONDITIONING_TYPE))
  @IsNumber()
  @RequiredField()
  airConditioningType: number;

  @IsIn(Object.values(PROPERTY_EXTERNAL))
  @IsNumber()
  @RequiredField()
  external: number;

  @IsIn(Object.values(PROPERTY_BASEMENT))
  @IsNumber()
  @RequiredField()
  basement: number;

  @IsBoolean()
  @RequiredField()
  hasKitchen: boolean;

  @IsBoolean()
  @RequiredField()
  hasFoyer: boolean;

  @IsBoolean()
  @RequiredField()
  hasBreakfast: boolean;

  @IsBoolean()
  @RequiredField()
  hasLivingroom: boolean;

  @IsBoolean()
  @RequiredField()
  hasDiningroom: boolean;

  @IsBoolean()
  @RequiredField()
  hasFamilyroom: boolean;

  @IsBoolean()
  @RequiredField()
  hasLaundry: boolean;

  @MaxLength(1000, { message: MAXIMUM_LENGTH(1000) })
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
  room: RoomDTO[]
}

export class RoomDTO {
  @ApiProperty({
    description: "Type of room",
    example: ROOM_TYPE.BEDROOM,
  })
  @IsNumber()
  @RequiredField()
  type: number;

  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, { message: 'Invalid room length format' })
  @IsNumberString({}, { message: 'Invalid room length format' })
  @RequiredField()
  length: number;

  @Matches(REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT, {
    message: 'Invalid room width format'
  })
  @IsNumberString({}, { message: 'Invalid room width format' })
  @RequiredField()
  width: number;

  @IsCorrectRoomFeature('feature', { message: 'Room feature invalid' })
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
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
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
  @IsIntCustom()
  @IsOptional()
  readonly page?: number = 0;

  @ApiPropertyOptional({
    minimum: 0,
    default: 9,
  })
  @Type(() => Number)
  @Min(0)
  @IsIntCustom()
  @IsOptional()
  readonly size?: number = 9;

  @Type(() => Number)
  @IsIn(Object.values(PROPERTY_STATUS))
  @IsIntCustom()
  @IsOptional()
  filterStatus: number

  @Type(() => String)
  @IsString()
  @IsOptional()
  search: string
}

export class DeleteOnePeropertyDTO extends GetOnePropertyDTO {}

export class PrimaryContactDTO {
  @ApiProperty({
    example: "Nathan",
  })
  @MaxLength(30, { message: MAXIMUM_LENGTH(30) })
  @IsString()
  @RequiredField()
  firstName: string;

  @ApiProperty({
    example: "Nathan",
  })
  @MaxLength(30, { message: MAXIMUM_LENGTH(30) })
  @IsString()
  @RequiredField()
  lastName: string;

  @ApiProperty({
    example: "+84 012 345 678",
  })
  @Matches(REGEX_INTERNATIONAL_PHONE_NUMBER, {
    message: 'The phone number is an invalid International Phone Number.'
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: "email@email.com",
  })
  @IsEmail({} , { message: "Enter a valid email" })
  @IsString()
  @RequiredField()
  email: string;

  @ApiProperty()
  @MaxLength(100, { message: MAXIMUM_LENGTH(100) })
  @IsString()
  @RequiredField()
  address: string;

  @ApiProperty()
  @MaxLength(25, { message: MAXIMUM_LENGTH(25) })
  @IsString()
  @RequiredField()
  city: string;

  @ApiProperty({
    description: "Id of country",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
  countryId: number;

  @ApiProperty({
    description: "Id of state",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
  stateId: number;

  @ApiProperty()
  @MaxLength(25, { message: MAXIMUM_LENGTH(25) })
  @IsString()
  @RequiredField()
  zipCode: string;
}

export class CreatePrimaryContactDTO extends PrimaryContactDTO {
  @ApiProperty({
    description: "Id of property",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
  propertyId: number;
}

export class UpdatePrimaryContactDTO extends PrimaryContactDTO {
  @ApiProperty({
    description: "Id of primary contact",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
  id: number;
}

export class GetPrimaryContactDTO {
  @ApiProperty({
    description: "Id of primary contact",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsIntCustom()
  @RequiredField()
  id: number;
}
