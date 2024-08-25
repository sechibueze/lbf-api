import { Claimer } from '../entities/claimer.entity';
import { LBFItem } from '../entities/lbf-item.entity';
import { AppDataSource as dataSource } from '../config/database.config';
import { AppError } from '../utils/error.util';

const claimerRepository = dataSource.getRepository(Claimer);
const lbfItemRepository = dataSource.getRepository(LBFItem);
export class ClaimerService {
  static async createClaimer(
    itemId: string,
    claimerData: Partial<Claimer>
  ): Promise<Claimer> {
    const lbfItem = await lbfItemRepository.findOne({
      where: { id: itemId },
    });
    if (!lbfItem) {
      throw new AppError('Item not found');
    }

    if (lbfItem.is_claimed) {
      throw new AppError('Item is already claimed');
    }

    const claimer = claimerRepository.create(claimerData);
    claimer.lbf_item = lbfItem;

    await claimerRepository.save(claimer);

    lbfItem.is_claimed = true;
    await lbfItemRepository.save(lbfItem);

    return claimer;
  }

  static async getClaimerByItemId(itemId: string): Promise<Claimer | null> {
    const lbfItem = await lbfItemRepository.findOne({
      where: {
        id: itemId,
      },
      relations: ['claimer'],
    });
    if (!lbfItem) {
      throw new AppError('Item not found');
    }

    return lbfItem.claimer || null;
  }

  static async getAllClaimers(): Promise<Claimer[]> {
    return claimerRepository.find({ relations: ['lbf_item'] });
  }
}
