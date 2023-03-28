import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export class CreateDTO {

}

export class UpdateDTO {

}

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
