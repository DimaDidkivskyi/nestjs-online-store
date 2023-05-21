import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserDto } from './dto/authUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Authorization function
  async signIn(body: AuthUserDto): Promise<{ access_token: string }> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        throw new NotFoundException(`User with email: ${body.email} not found`);
      }

      const hashPassword = await bcrypt.hash(body.password, 10);

      if (await bcrypt.compare(hashPassword, user.password)) {
        throw new UnauthorizedException('Password is incorrect');
      }

      const tokens = await this.signToken(user.user_id, user.email, user.role);

      await this.updateUserRt(user.user_id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Unexpected error in function "signIn"');
    }
  }

  // Registration function
  async signUp(body: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const createUser = await this.prismaService.user.create({
        data: {
          ...body,
          password: hashedPassword,
        },
      });

      const tokens = await this.signToken(
        createUser.user_id,
        createUser.email,
        createUser.role,
      );

      await this.updateUserRt(createUser.user_id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Unexpected error while creating profile');
    }
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new ForbiddenException('Access denied 1');
    }

    console.log(refreshToken);

    const rtMatches = await bcrypt.compare(refreshToken, user.refresh_token);

    if (!rtMatches) {
      throw new ForbiddenException('Access denied 2');
    }

    const tokens = await this.signToken(user.user_id, user.email, user.role);

    await this.updateUserRt(user.user_id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    await this.prismaService.user.updateMany({
      where: { user_id: userId, refresh_token: { not: null } },
      data: { refresh_token: null },
    });
  }

  // Function to craete access and refresh tokens
  async signToken(
    userId: string,
    email: string,
    role: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { email: email, roles: role, sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      }),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async updateUserRt(userId: string, refreshToken: string) {
    const hashedRt = await bcrypt.hash(refreshToken, 10);

    const updateUser = await this.prismaService.user.update({
      where: { user_id: userId },
      data: { refresh_token: hashedRt },
    });

    return updateUser;
  }
}
