import { IsEmail, IsString } from 'class-validator';

export class AuthUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
