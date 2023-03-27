import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SearchUserDTO {
  @ApiProperty({
    required: true,
    example: 'email',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Input’s maximum length is 100 characters.' })
  email: string;
}
