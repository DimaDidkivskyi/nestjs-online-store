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
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findUsers(@Query() query) {
    return await this.usersService.findUsers(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async findUserProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update_user_info')
  async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserInfo(req.user, updateUserDto);
  }
}
