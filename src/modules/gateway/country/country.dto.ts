import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";
import { IsBiggerThanZero, RequiredField } from "src/share/common/base.dto";

export class GetAllStateOfCountryDTO {
  @ApiProperty({
    description: "Id of country",
    required: true,
    example: 1,
  })
  @IsBiggerThanZero()
  @Type(() => Number)
  @IsInt({ message: "Invalid id format" })
  @RequiredField()
  id: number;
}
