import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findProducts() {
    try {
      return await this.prisma.product.findMany();
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findProduct(id) {
    try {
      return await this.prisma.product.findFirst({
        where: {
          product_id: id,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createProduct(productData) {
    try {
      return await this.prisma.product.create({ data: { ...productData } });
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProduct(id, updateData) {
    try {
      return await this.prisma.product.update({
        where: { product_id: id },
        data: { ...updateData },
      });
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteProduct(id) {
    try {
      return await this.prisma.product.delete({ where: { product_id: id } });
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
