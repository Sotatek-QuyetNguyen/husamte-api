import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsNumberString, Matches, registerDecorator, ValidateNested, ValidationArguments, ValidationOptions } from "class-validator";
import { IsBiggerThanZero } from "src/share/common/base.dto";

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
  @Matches(/^\d{0,10}(\.\d{2,})?$/, {
    message: 'percentage must be a number have 2 digits after decimal'
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