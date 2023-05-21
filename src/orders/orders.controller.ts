import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AccessTokenGuard } from 'src/common/guards';
import { GetUser } from 'src/common/decorators';
import { CreateOrderDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findOrders() {
    return await this.ordersService.findOrders();
  }

  @Get('/:id')
  async findOrder(@Param('id') orderId: string) {
    return await this.ordersService.findOrder(orderId);
  }

  @Post('create')
  @UseGuards(AccessTokenGuard)
  async createOrder(
    @GetUser('sub') userId: string,
    @Body() orderData: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, orderData);
  }
}
