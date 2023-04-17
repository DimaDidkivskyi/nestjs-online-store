import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { AccessTokenGuard } from 'src/common/guards';
import { GetUser } from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findUsers(@Query() query) {
    return await this.usersService.findUsers(query);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async findUserProfile(@GetUser('sub') userId: string) {
    return this.usersService.findUserProfile(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/update_user_info')
  async updateUser(
    @GetUser('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserInfo(userId, updateUserDto);
  }
}
