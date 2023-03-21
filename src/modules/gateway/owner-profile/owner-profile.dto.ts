import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsBiggerThanZero(
  property: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBiggerThanZero',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value > 0;
        },
      },
    });
  };
}

export class OwnerProfileDto {
  @ApiProperty({
    required: true,
    example: 'Nathan',
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @MaxLength(30, { message: 'Input’s maximum length is 30 characters.' })
  firstName: string;

  @ApiProperty({
    required: true,
    example: 'Dinh',
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @MaxLength(30, { message: 'Input’s maximum length is 30 characters.' })
  lastName: string;

  @ApiProperty({
    description: 'Owner of asset',
    required: true,
    example: 'Nathan Dinh',
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @MaxLength(128, { message: 'Input’s maximum length is 128 characters.' })
  ownerName: string;

  @ApiProperty({
    required: true,
    example: 1,
  })
  @IsNumber()
  ownershipType: number

  @ApiProperty({
    required: true,
    example: 'example.com',
  })
  @IsString()
  @Type(() => String)
  @MaxLength(255, { message: 'Input’s maximum length is 255 characters.' })
  website: string

  @ApiProperty({
    example: 'owner',
  })
  @IsString()
  @Type(() => String)
  @MaxLength(255, { message: 'Input’s maximum length is 255 characters.' })
  relationship: string

  @ApiProperty({
    example: 'Description about owner',
  })
  @IsString()
  @Type(() => String)
  @MaxLength(1000, { message: 'Input’s maximum length is 1000 characters.' })
  summary: string

  @ApiProperty()
  @IsString()
  @Type(() => String)
  @MaxLength(255, { message: 'Input’s maximum length is 255 characters.' })
  businessSector: string

  @ApiProperty({
    required: true,
    example: 'owner',
  })
  @IsBoolean()
  @Type(() => Boolean)
  incorporated: boolean
}

export class CreateOrUpdateOwnerProfileDto extends OwnerProfileDto {
  @ApiProperty({
    description: "Id of asset profile",
    required: true,
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @IsBiggerThanZero('assetId', {
    message: 'Input must be greater than 0.',
  })
  assetId: number
}
