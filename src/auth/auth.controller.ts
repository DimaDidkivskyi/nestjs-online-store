import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto, CreateUserDto } from './dto';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import { GetUser } from 'src/common/decorators';

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

  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@GetUser() user: object) {
    return await this.authService.refreshToken(
      user['sub'],
      user['refreshToken'],
    );
  }

  @Post('/logout')
  @UseGuards(AccessTokenGuard)
  async logout(@GetUser('sub') userId: string) {
    return await this.authService.logout(userId);
  }
}
