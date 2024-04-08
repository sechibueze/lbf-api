import { AppDataSource as dataSource } from '../config/database.config';
import { User } from '../entities/user.entity';
import bcrypt from 'bcryptjs';
import { NOTIFICATION_FILTER, Notifier } from '../libs/notification.lib';
import { z } from 'zod';
import { createUserSchema } from '../schema/user.schema';
import { AuthService } from './auth.service';
import { createVentureSchema } from '../schema/venture.schema';
import { Venture } from '../entities/venture.entity';
import { NOTFOUND } from 'dns/promises';
import { query } from 'express';

interface ventureQueryOption {
  owner?: {
    id?: string;
    email?: string;
  };
  id?: string;
}
export class VentureService {
  static async getVenture({
    ownerId,
    ventureId,
  }: {
    ownerId?: string;
    ventureId?: string;
  }) {
    const whereCondition: ventureQueryOption = {};
    if (ownerId)
      whereCondition.owner = {
        id: ownerId,
      };
    if (ventureId) whereCondition.id = ventureId;
    if (!ownerId && !ventureId) throw new Error('Invalid input supplied!');

    try {
      const ventureRepository = dataSource.getRepository(Venture);

      const venture = await ventureRepository.findOne({
        where: whereCondition,
      });

      return venture;
    } catch (error) {
      throw new Error('Failed to get venture details');
    }
  }
  static async createVenture(data: any) {
    const existingVenture = await this.getVenture({ ownerId: data.owner });

    if (existingVenture) {
      throw new Error('Business already exists');
    }

    const ventureRepository = dataSource.getRepository(Venture);
    const newVenture = await ventureRepository.save({
      ...data,
    });

    const notified = new Notifier().sendEmail(newVenture.email, {
      name: newVenture.name,
      subject: `Welcome to Pamundo – Your Gateway to the World of Ethnic Products`,
      topic:
        newVenture.type === 'Wholesaler'
          ? NOTIFICATION_FILTER.WHOLESALER_CREATED
          : NOTIFICATION_FILTER.RETAILER_CREATED,
    });

    return { id: newVenture.id };
  }
}
