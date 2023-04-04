import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthUserDto } from './dto/authUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(body: AuthUserDto) {
    try {
      const user = await this.usersService.findUser(body.email);

      if (!user) {
        throw new NotFoundException(`User with email: ${body.email} not found`);
      }

      const hashPassword = await bcrypt.hash(body.password, 0);

      if (await bcrypt.compare(hashPassword, user.password)) {
        throw new UnauthorizedException('Password is incorrect');
      }

      return await this.signTokken(user.user_id, user.email);
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Unexpected error in function "signIn"');
    }
  }

  async signUp(body: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const createUser = await this.usersService.createUser({
        ...body,
        password: hashedPassword,
      });

      return createUser;
    } catch (error) {
      throw new BadRequestException('Unexpected error while creating profile');
    }
  }

  async signTokken(
    user_id: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { email: email, sub: user_id };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return { access_token: token };
  }
}
