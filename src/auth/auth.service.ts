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

  // Authorization function
  async signIn(body: AuthUserDto): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findUserByEmail(body.email);

      if (!user) {
        throw new NotFoundException(`User with email: ${body.email} not found`);
      }

      const hashPassword = await bcrypt.hash(body.password, 10);

      if (await bcrypt.compare(hashPassword, user.password)) {
        throw new UnauthorizedException('Password is incorrect');
      }

      return await this.signToken(user.user_id, user.email);
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Unexpected error in function "signIn"');
    }
  }

  // Registration function
  async signUp(body: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const createUser = await this.usersService.createUser({
        ...body,
        password: hashedPassword,
      });

      return await this.signToken(createUser.user_id, createUser.email);
    } catch (error) {
      throw new BadRequestException('Unexpected error while creating profile');
    }
  }

  // Function to craete access token
  async signToken(
    user_id: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { email: email, sub: user_id };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_SECRET'),
    });

    return { access_token: token };
  }
}
