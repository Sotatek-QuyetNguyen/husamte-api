import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export class CreateDTO {

}

export class UpdateDTO {

}

export function IsBiggerThanZero(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsBiggerThanZero',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value > 0;
        },
        defaultMessage() {
          return `$property must be greater than 0`;
        }
      },
    });
  };
}

export function IsSmallerThan100(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsSmallerThan100',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value < 100;
        },
        defaultMessage() {
          return `$property must be smaller than 100`;
        }
      },
    });
  };
}

export function RequiredField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'RequiredField',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (value != undefined) && (value != null);
        },
        defaultMessage() {
          return `$property field is required`;
        }
      },
    });
  };
}

export function IsIntCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsIntCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return parseInt(value) === value;
        },
        defaultMessage() {
          return `$property can only contain number.`;
        }
      },
    });
  };
}
