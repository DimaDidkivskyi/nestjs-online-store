import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createUser(createUserDto) {
    try {
      const createUser = await this.prisma.user.create({
        data: { ...createUserDto },
      });

      return createUser;
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred during during user creation',
        HttpStatus.BAD_REQUEST,
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
