import { AppDataSource as dataSource } from '../config/database.config';
import { User } from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { appConfig } from '../constants/app.constant';
import { NOTIFICATION_FILTER, Notifier } from '../libs/notification.lib';
import { z } from 'zod';
import { loginUserSchema } from '../schema/user.schema';
import { UserService } from './user.service';
import { AppResponse } from '../libs/response.lib';

export class AuthService {
  static generateVerificationToken(length: number = 6) {
    const digits = '0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += digits[Math.floor(Math.random() * digits.length)];
    }
    return token;
  }

  static async loginUser(data: z.infer<typeof loginUserSchema>) {
    const userRepository = dataSource.getRepository(User);

    try {
      const [user] = await userRepository.find({
        where: { email: data.email },
        select: ['id', 'email', 'password'],
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, appConfig.JWT_SECRET_KEY, {
        expiresIn: '1h',
      });

      return { token };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async verifyAccount(email, verificationToken) {
    let filter: { email?: string; id?: string } = {};
    if (email.includes('@')) {
      filter.email = email;
    } else {
      filter.id = email;
    }
    const user = await UserService.getUser({ ...filter });
    if (user.is_verified_email) {
      return { message: 'Account already verified' };
    }
    const isValidToken = await bcrypt.compare(
      verificationToken,
      user.email_confirm_token_hash
    );
    if (!isValidToken) {
      throw new Error('Invalid verification code');
    }
    user.is_verified_email = true;
    user.email_confirm_token_hash = null;
    await user.save();

    const notified = new Notifier().sendAccountEmail(user.email, {
      name: user.full_name,
      subject: 'Welcome to Pamundo - Account confirmed!',
      login: `${appConfig.FRONTEND_URL}/auth`,
      topic: NOTIFICATION_FILTER.ACCOUNT_VERIFIED,
    });
    return { message: 'Account verified successfully' };
  }

  static async resendToken(email: string) {
    if (!email) {
      throw new Error('Invalid user input');
    }

    let filter: { email?: string; id?: string } = {};
    if (email.includes('@')) {
      filter.email = email;
    } else {
      filter.id = email;
    }
    const user = await UserService.getUser({ ...filter });

    if (user.is_verified_email) {
      return { message: `Account already verified` };
    }
    const token = this.generateVerificationToken();
    const hashedToken = await bcrypt.hash(token, 10);
    user.email_confirm_token_hash = hashedToken;

    user.save();

    const notified = new Notifier().sendAccountEmail(user.email, {
      name: user.full_name,
      subject: 'Verify your Pamundo Account',
      token,
      topic: NOTIFICATION_FILTER.ACCOUNT_NEW,
    });

    return { message: `Account  verified` };
  }
}
