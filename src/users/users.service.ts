import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Funtion to find all users based on filter and order params
  async findUsers(query) {
    try {
      let skipUsers = 0;

      if ('page' in query) {
        skipUsers = (query.page - 1) * 10;
      }

      const filterParam = this.getFilterParam(query);
      const orderParam = this.getOrderParam(query);

      const usersList = await this.prisma.user.findMany({
        where: { AND: filterParam },
        select: {
          user_id: true,
          email: true,
          name: true,
          surname: true,
          role: true,
        },
        orderBy: orderParam,
        skip: skipUsers,
        take: 10,
      });

      return usersList;
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred when searching for users',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Getting filter param from query to filter the list of user
  getFilterParam(query) {
    const filterParam = [];

    if ('name' in query) {
      filterParam.push({ name: query.name });
    }

    if ('surname' in query) {
      filterParam.push({ surname: query.surname });
    }

    if ('email' in query) {
      filterParam.push({ email: query.email });
    }

    if ('phone_number' in query) {
      filterParam.push({ phone_number: query.phone_number });
    }

    return filterParam;
  }

  // Getting the sort param from query to sort the list of users
  getOrderParam(query) {
    let orderBy: object;

    if ('sort' in query) {
      switch (query.sort) {
        case 'name_ascend':
          orderBy = { name: 'asc' };
          break;
        case 'name_descend':
          orderBy = { name: 'desc' };
          break;
        case 'email_ascend':
          orderBy = { email: 'asc' };
          break;
        case 'email_descend':
          orderBy = { email: 'desc' };
          break;
      }
    } else {
      orderBy = {};
    }

    return orderBy;
  }

  async findUserProfile(userId: string) {
    return await this.prisma.user.findUnique({ where: { user_id: userId } });
  }

  // // Funtion to create user
  // async createUser(createUserDto: CreateUserDto): Promise<User> {
  //   try {
  //     const createUser = await this.prisma.user.create({
  //       data: { ...createUserDto },
  //     });

  //     delete createUser.password;

  //     return createUser;
  //   } catch (error) {
  //     throw new BadRequestException(
  //       'Unexpected error occurred during during user creation',
  //     );
  //   }
  // }

  // Function to update user information
  async updateUserInfo(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const updateUser = await this.prisma.user.update({
        where: { user_id: userId },
        data: { ...updateUserDto },
      });

      return updateUser;
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred during user updating',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
