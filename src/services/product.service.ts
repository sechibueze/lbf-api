import { DeepPartial, FindOneOptions } from 'typeorm';
import { AppDataSource as dataSource } from '../config/database.config';
import { Product } from '../entities/product.entity';
import { createProductSchema } from '../schema/product.schema';
import { z } from 'zod';
import { AppError } from '../utils/error.util';
interface ProductResultSet {
  products: Product[];
  meta: {
    page: number;
    limit: number;
    skip: number;
    total_items: number;
  };
}

interface iSearchCriteria {
  ownerId?: string;
  segmentId?: string;

  // Search and filter
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;

  // Add pagination parameters
  page?: number;
  limit?: number;
}
export class ProductService {
  static async createProduct(productData: z.infer<typeof createProductSchema>) {
    try {
      const productRepository = dataSource.getRepository(Product);
      const newProduct = await productRepository.save(
        productData as DeepPartial<Product>
      );
      return newProduct;
    } catch (error) {
      throw new Error(error.message || 'Failed to create product');
    }
  }
  static async getProduct({ productId, owner }) {
    try {
      const productRepository = dataSource.getRepository(Product);
      const findOpts: FindOneOptions = {
        relations: {
          segment: true,
          owner: true,
        },
      };

      if (productId) findOpts.where = { id: productId, owner: { id: owner } };
      const existingProduct = await productRepository.findOne(findOpts);
      return existingProduct;
    } catch (error) {
      throw new AppError(error.message || 'Failed to create product');
    }
  }

  static async listProducts() {
    try {
      const productRepository = dataSource.getRepository(Product);
      const productList = await productRepository.find({
        where: {},
        relations: {
          segment: true,
          owner: true,
        },
      });
      return productList;
    } catch (error) {
      throw new Error(error.message || 'Failed to create product');
    }
  }
  static async searchAndFilterProducts(
    searchCriteria: iSearchCriteria
  ): Promise<ProductResultSet> {
    const productRepository = dataSource.getRepository(Product);

    const queryBuilder = productRepository.createQueryBuilder('product');
    // .leftJoinAndSelect('product.owner', 'owner');

    // Build search query
    if (searchCriteria.search) {
      queryBuilder
        .andWhere('LOWER(product.name) like :name', {
          name: `%${searchCriteria.search.toLowerCase()}%`,
        })
        .orWhere('LOWER(product.description) like :name', {
          description: `%${searchCriteria.search.toLowerCase()}%`,
        });
    }

    if (searchCriteria.min_price) {
      queryBuilder.andWhere('product.amount >= :minPrice', {
        minPrice: searchCriteria.min_price,
      });
    }

    if (searchCriteria.max_price) {
      queryBuilder.andWhere('product.amount <= :maxPrice', {
        maxPrice: searchCriteria.max_price,
      });
    }

    if (searchCriteria.ownerId) {
      queryBuilder.andWhere('product.owner = :ownerId', {
        ownerId: searchCriteria.ownerId,
      });
    }
    if (searchCriteria.segmentId) {
      queryBuilder.andWhere('product.segment = :segmentId', {
        segmentId: searchCriteria.segmentId,
      });
    }

    queryBuilder.orderBy('product.amount', 'ASC');

    // Pagination
    const page = Number(searchCriteria.page) || 1;
    const limit = Number(searchCriteria.limit) || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [products, totalItems] = await queryBuilder.getManyAndCount();

    return {
      products,
      meta: {
        page,
        limit,
        skip,
        total_items: totalItems,
      },
    };
  }
}
