import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findProducts(query): Promise<Product[]> {
    try {
      let skipProducts = 0;

      if ('page' in query) {
        skipProducts = (query.page - 1) * 10;
      }

      const orderParam = this.getOrderParam(query);
      const filterParam = this.getFilterParam(query);

      const products = await this.prisma.product.findMany({
        where: { AND: filterParam },
        orderBy: orderParam,
        skip: skipProducts,
        take: 10,
      });

      return products;
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getOrderParam(query) {
    let orderBy: object;

    if ('sort' in query) {
      switch (query.sort) {
        case 'cheap':
          orderBy = { price: 'asc' };
          break;

        case 'expensive':
          orderBy = { price: 'desc' };
          break;

        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;

        case 'oldest':
          orderBy = { createdAt: 'asc' };
          break;
      }
    }

    return orderBy;
  }

  private getFilterParam(query) {
    const filterParamList = [];

    if ('price' in query) {
      filterParamList.push({ price: +query.price });
    }

    if ('category' in query) {
      filterParamList.push({ category: query.category });
    }

    return filterParamList;
  }

  async findProduct(id: string): Promise<Product> {
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

  async createProduct(productData: CreateProductDto): Promise<Product> {
    try {
      return await this.prisma.product.create({ data: { ...productData } });
    } catch (error) {
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProduct(
    id: string,
    updateData: UpdateProductDto,
  ): Promise<Product> {
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

  async deleteProduct(id: string): Promise<Product> {
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
