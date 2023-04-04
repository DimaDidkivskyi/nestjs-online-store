import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto, CreateUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async signIn(@Body() body: AuthUserDto) {
    return this.authService.signIn(body);
  }

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body);
  }
}
