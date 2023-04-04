import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Get all users matching the filter parametrs
  async findUsers(query): Promise<User[]> {
    try {
      let skipUsers = 0;

      if ('page' in query) {
        skipUsers = (query.page - 1) * 10;
      }

      const filterParam = this.getFilterParam(query);
      const orderParam = this.getOrderParam(query);

      const usersList = await this.prisma.user.findMany({
        where: { AND: filterParam },
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

  // Get filter param from query to filter the list of user
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

  // Get the sort param from query to sort the list of users
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

  // Find user by email
  async findUser(submittedEmail): Promise<User> {
    return this.prisma.user.findFirst({ where: { email: submittedEmail } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createUser = await this.prisma.user.create({
        data: { ...createUserDto },
      });

      return createUser;
    } catch (error) {
      throw new BadRequestException(
        'Unexpected error occurred during during user creation',
      );
    }
  }

  //   async updateUser(updateUserDto) {
  //     // const updateUser = await this.prisma.user.update({
  //     //   data: { ...updateUserDto },
  //     // });
  //     try {
  //       return 'User updated';
  //     } catch (error) {
  //       throw new HttpException(
  //         'Unexpected error occurred during user updating',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }
}
