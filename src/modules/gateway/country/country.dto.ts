import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { IsBiggerThanZero } from "src/share/common/base.dto";

export class GetAllStateOfCountryDTO {
  @ApiProperty({
    description: "Id of country",
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
