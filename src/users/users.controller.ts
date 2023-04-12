import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto';
import { AccessTokenGuard } from 'src/common/guards';

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
  async findUserProfile(@Req() req: Request) {
    const user = req.user;
    return this.usersService.findUserProfile(user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/update_user_info')
  async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user;
    return this.usersService.updateUserInfo(user['sub'], updateUserDto);
  }
}
