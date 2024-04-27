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
import { resetPasswordSchema } from '../schema/auth.schema';
import { AppError } from '../utils/error.util';
import { FindOptionsSelect, FindOptionsWhere } from 'typeorm';

export class AuthService {
  static generateVerificationToken(length: number = 6) {
    const digits = '0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += digits[Math.floor(Math.random() * digits.length)];
    }
    return token;
  }

  static async getUserDataWithSelection(
    filter: FindOptionsWhere<User>,
    selectedColumns: FindOptionsSelect<User>
  ) {
    try {
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: filter,
        select: selectedColumns,
      });
      return user;
    } catch (error) {
      throw new AppError(error.message);
    }
  }

  static async loginUser(data: z.infer<typeof loginUserSchema>) {
    const userRepository = dataSource.getRepository(User);

    try {
      // const user = await userRepository.findOne({
      //   where: { email: data.email },
      //   select: ['id', 'email', 'password'],
      // });
      const filter = { email: data.email };
      const selectedColumns = [
        'id',
        'email',
        'password',
      ] as FindOptionsSelect<User>;
      const user = await this.getUserDataWithSelection(filter, selectedColumns);
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
  static async verifyAccount(identifier: string, verificationToken) {
    let filter: { email?: string; id?: string } = {};
    if (identifier.includes('@')) {
      filter.email = identifier;
    } else {
      filter.id = identifier;
    }

    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: filter,
      select: ['id', 'email', 'is_verified_email', `email_confirm_token_hash`],
    });
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

  static async resendAccountVerificationToken(identifier: string) {
    if (!identifier) {
      throw new Error('Invalid identifier provided');
    }
    let filter: { email?: string; id?: string } = {};
    if (identifier.includes('@')) {
      filter.email = identifier;
    } else {
      filter.id = identifier;
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
  static async sendPasswordResetToken(email: string) {
    if (!email) {
      throw new Error('Invalid user input');
    }

    const user = await UserService.getUser({ email });

    if (!user) {
      throw new Error('Account does not exist');
    }
    const token = this.generateVerificationToken();
    const hashedToken = await bcrypt.hash(token, 10);
    user.password_reset_token_hash = hashedToken;

    user.save();

    const notified = new Notifier().sendEmail(user.email, {
      name: user.full_name,
      subject: 'Reset your password on Pamundo',
      token,
      topic: NOTIFICATION_FILTER.PASSWORD_RESET_TOKEN,
    });

    return { message: `Password reset token sent`, data: { id: user.id } };
  }
  static async resetPassword({
    id: userId,
    token,
    password,
  }: z.infer<typeof resetPasswordSchema>) {
    const user = await UserService.getUser({ id: userId });

    if (!user.password_reset_token_hash) {
      throw new Error(`Invalid request`);
    }
    const isValidToken = await bcrypt.compare(
      token,
      user.password_reset_token_hash
    );
    if (!isValidToken) {
      throw new Error('Invalid verification code');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.password_reset_token_hash = null;

    user.save();

    const notified = new Notifier().sendEmail(user.email, {
      name: user.full_name,
      subject: 'Password Reset',
      topic: NOTIFICATION_FILTER.PASSWORD_RESET_COMPLETE,
    });

    return { message: `Password successfully reset` };
  }
}
