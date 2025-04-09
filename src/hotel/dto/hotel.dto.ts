import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class hotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  image?: string;
}
