import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findProducts() {
    return await this.productsService.findProducts();
  }

  @Get('/:id')
  async findProduct(@Param('id') id: string) {
    return await this.productsService.findProduct(id);
  }

  @Post()
  async createProduct(@Body() productDto: ProductDto) {
    return await this.productsService.createProduct(productDto);
  }

  @Patch('/:id')
  async updateProduct(@Param('id') id: string, @Body() productDto: ProductDto) {
    return await this.productsService.updateProduct(id, productDto);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
