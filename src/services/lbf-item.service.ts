import { DeepPartial, FindOneOptions } from 'typeorm';
import { AppDataSource as dataSource } from '../config/database.config';
import { LBFItem } from '../entities/lbf-item.entity';
import { createLBFItemSchema } from '../schema/lbf-item.schema';
import { z } from 'zod';
import { AppError } from '../utils/error.util';
interface LBFItemResultSet {
  lbf_items: LBFItem[];
  meta: {
    page: number;
    per_page: number;
    total_items: number;
  };
}

interface iSearchCriteria {
  // Search and filter
  search?: string;
  tag?: string;

  // Add pagination parameters
  page?: number;
  limit?: number;
}
export class LBFItemService {
  static async registerLBFItem(
    lbfItemData: z.infer<typeof createLBFItemSchema>
  ) {
    try {
      const lbfItemRepository = dataSource.getRepository(LBFItem);
      const newLbf = await lbfItemRepository.save(
        lbfItemData as DeepPartial<LBFItem>
      );
      return newLbf;
    } catch (error) {
      throw new AppError(error.message || 'Failed to register LBF Item');
    }
  }
  static async getLBFItem({ itemId }) {
    try {
      const lbfItemRepository = dataSource.getRepository(LBFItem);
      const findOpts: FindOneOptions = {
        where: {
          id: itemId,
        },
        relations: {
          owner: true,
        },
      };

      const existingLBFItem = await lbfItemRepository.findOne(findOpts);
      return existingLBFItem;
    } catch (error) {
      throw new AppError(error.message || 'Failed to fetch item');
    }
  }

  static async listLBFItems() {
    try {
      const lbfItemRepository = dataSource.getRepository(LBFItem);
      const lbfItems = await lbfItemRepository.find();
      return lbfItems;
    } catch (error) {
      throw new AppError(error.message || 'Failed to list LBF Items');
    }
  }
  static async searchAndFilterLBFItems(
    searchCriteria: iSearchCriteria
  ): Promise<LBFItemResultSet> {
    const lbfItemRepository = dataSource.getRepository(LBFItem);
    const queryBuilder = lbfItemRepository.createQueryBuilder('lbf_item');

    // Build search query
    if (searchCriteria.search) {
      queryBuilder
        .where('LOWER(lbf_item.name) like :name', {
          name: `%${searchCriteria.search.toLowerCase()}%`,
        })
        .orWhere('LOWER(lbf_item.description) like :name', {
          description: `%${searchCriteria.search.toLowerCase()}%`,
        });
    }
    if (searchCriteria.tag) {
      queryBuilder.andWhere('LOWER(lbf_item.tags) like :tag', {
        tag: `%${searchCriteria.tag.toLowerCase()}%`,
      });
    }

    queryBuilder.orderBy('lbf_item.createdAt', 'DESC');

    // Pagination
    const page = Number(searchCriteria.page) || 1;
    const limit = Number(searchCriteria.limit) || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [lbf_items, totalItems] = await queryBuilder.getManyAndCount();
    return {
      lbf_items,

      meta: {
        page,
        per_page: limit,
        total_items: totalItems,
      },
    };
  }
}
