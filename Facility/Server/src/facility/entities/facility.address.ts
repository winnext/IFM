import { ApiProperty } from "@nestjs/swagger";

export class Adress  {
    @ApiProperty()
    country: string;
    @ApiProperty()
    city: string
    @ApiProperty()
    adress: string;
  };