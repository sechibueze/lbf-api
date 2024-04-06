import { AppDataSource as dataSource } from '../config/database.config';
import { Business } from '../entities/business.entity';
import { User } from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { appConfig } from '../constants/app.constant';
import { Notifier } from '../libs/notification.lib';
function generateVerificationToken() {
  const digits = '0123456789';
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += digits[Math.floor(Math.random() * digits.length)];
  }
  return token;
}
export class AccountService {
  static async getUser(email: string, id: string = '') {
    const queryOption: { email?: string; id?: string } = {};
    if (email) queryOption.email = email;
    if (id) queryOption.id = id;
    if (!queryOption.email && !queryOption.id) throw new Error('Invalid input');
    try {
      const userRepository = dataSource.getRepository(User);

      const user = await userRepository.findOneBy({ ...queryOption });
      return user;
    } catch (error) {
      throw new Error('Failed to get user details');
    }
  }
  static async createUserAndBusiness(data: any) {
    const userRepository = dataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ email: data.email });

    if (existingUser) {
      throw new Error('Account already exists');
    }
    const token = generateVerificationToken();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const hashedToken = await bcrypt.hash(token, 10);
    const newUser = await userRepository.save({
      full_name: data.full_name,
      email: data.email,
      password: hashedPassword,
      email_confirm_token_hash: hashedToken,
    });

    const businessRepository = dataSource.getRepository(Business);
    const newBusiness = await businessRepository.save({
      ...data.business,
      owner: newUser.id,
    });

    const notified = new Notifier().sendAccountEmail(newUser.email, {
      name: newUser.full_name,
      subject: 'New Pamundo Account',
      token,
      topic: 'Account.new',
    });

    return { user: newUser, business: newBusiness };
  }

  static async loginUser(data) {
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
    const user = await this.getUser(email);
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
      subject: 'Hello from Pamundo',
      login: `${appConfig.FRONTEND_URL}/auth`,
      topic: 'Account.created',
    });
    return { message: 'Account verified successfully' };
  }

  static async resendToken(email: string) {
    if (!email) {
      throw new Error('Invalid user input');
    }
    const user = await this.getUser(email);
    const token = generateVerificationToken();
    const hashedToken = await bcrypt.hash(token, 10);
    user.email_confirm_token_hash = hashedToken;

    user.save();

    const notified = new Notifier().sendAccountEmail(user.email, {
      name: user.full_name,
      subject: 'New Pamundo Account',
      token,
      topic: 'Account.new',
    });

    return user;
  }
}
