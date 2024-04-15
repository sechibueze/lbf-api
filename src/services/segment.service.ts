import { AppDataSource as dataSource } from '../config/database.config';

import { Segment } from '../entities/segment.entity';
import { FindManyOptions } from 'typeorm';
import CacheService from '../libs/cache-service.lib';

const cacheService = new CacheService();
(async () => {
  await cacheService.connect();
})();
export class SegmentService {
  static async getSegment({ segmentId }: { segmentId?: string }) {
    try {
      const segmentRepository = dataSource.getRepository(Segment);

      const segment = await segmentRepository.findOneBy({
        id: segmentId,
      });

      return segment;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async listSegments({ segmentName }: { segmentName?: string }) {
    try {
      const cacheKey = segmentName ? `segments/${segmentName}` : `segments`;
      const cachedSegments = await cacheService.get(cacheKey);
      if (cachedSegments) return JSON.parse(cachedSegments);

      const segmentRepository = dataSource.getRepository(Segment);
      const filter: FindManyOptions = segmentName
        ? {
            where: {
              name: segmentName,
            },
            relations: {
              products: true,
            },
          }
        : {};

      const segments = await segmentRepository.find(filter);
      await cacheService.set(cacheKey, JSON.stringify(segments));
      return segments;
    } catch (error) {
      throw Error(error || 'Failed to get segment details');
    }
  }
  static async createSegment(data: any) {
    try {
      const segmentRepository = dataSource.getRepository(Segment);
      const savedSegment = await segmentRepository.save(data);
      return savedSegment;
    } catch (error) {
      throw new Error(error.message || 'Failed to create segment');
    }
  }
  static async onNewSegment() {
    try {
      await cacheService.del('segments');
    } catch (error) {
      throw new Error(error.message || 'Failed to update segment cache');
    }
  }
}
