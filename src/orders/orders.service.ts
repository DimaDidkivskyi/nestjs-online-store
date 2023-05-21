import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOrders() {
    const ordersList = await this.prismaService.order.findMany();

    return ordersList;
  }

  async findOrder(orderId: string): Promise<Order> {
    const order = await this.prismaService.order.findFirst({
      where: { order_id: orderId },
    });

    return order;
  }

  async createOrder(userId: string, orderData: CreateOrderDto): Promise<Order> {
    const user = await this.prismaService.user.findFirst({
      where: { user_id: userId },
    });

    const createOrder = await this.prismaService.order.create({
      data: { ...orderData, customer_id: user.user_id },
    });

    return createOrder;
  }
}
