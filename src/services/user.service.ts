import { AppDataSource as dataSource } from '../config/database.config';
import { User } from '../entities/user.entity';
import bcrypt from 'bcryptjs';
import { NOTIFICATION_FILTER, Notifier } from '../libs/notification.lib';
import { z } from 'zod';
import { createUserSchema } from '../schema/user.schema';
import { AuthService } from './auth.service';
import { AppError } from '../utils/error.util';

interface userQueryOption {
  email?: string;
  id?: string;
}
export class UserService {
  static async getUser({ email, id: userId }: userQueryOption) {
    const queryOption: userQueryOption = {};
    if (email) queryOption.email = email;
    if (userId) queryOption.id = userId;
    if (!queryOption.email && !queryOption.id)
      throw new Error('Invalid input supplied!');
    try {
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOneBy({ ...queryOption });
      return user;
    } catch (error) {
      throw new AppError(`Failed to get user details ${error}`);
    }
  }
  static async createUser(data: z.infer<typeof createUserSchema>) {
    const existingUser = await this.getUser({ email: data.email });

    if (existingUser) {
      throw new AppError('Account already exists');
    }
    const token = AuthService.generateVerificationToken();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const hashedToken = await bcrypt.hash(token, 10);
    const userRepository = dataSource.getRepository(User);
    const newUser = await userRepository.save({
      full_name: data.full_name,
      email: data.email,
      password: hashedPassword,
      email_confirm_token_hash: hashedToken,
    });

    const notified = new Notifier().sendAccountEmail(newUser.email, {
      name: newUser.full_name,
      subject: 'Lost But Found Signup Verification Code',
      token,
      topic: NOTIFICATION_FILTER.ACCOUNT_NEW,
    });

    return { id: newUser.id };
  }
}
