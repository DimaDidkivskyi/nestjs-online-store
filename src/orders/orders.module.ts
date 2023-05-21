import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
// import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  // imports: [UsersService],
})
export class OrdersModule {}
