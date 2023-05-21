import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Roles } from 'src/auth/role_authorization/role.decorator';
import { Role } from 'src/auth/role_authorization/role.enum';
import { RoleGuard } from 'src/auth/role_authorization/roles.guard';
import { AccessTokenGuard } from 'src/common/guards';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findProducts(@Query() query) {
    return await this.productsService.findProducts(query);
  }

  @Get('/:id')
  async findProduct(@Param('id') id: string) {
    return await this.productsService.findProduct(id);
  }

  @Post()
  @Roles(Role.Admin)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductDto);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
