import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  characteristics: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}
