import { createClient } from 'redis';

class CacheService {
  private client;

  async connect() {
    this.client = await createClient()
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect();
    console.log('Connected to redis', this.client);
    return this;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      await this.client.set(key, value, {});
      if (ttlSeconds) this.client.expire(key, ttlSeconds);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async get<T>(key: string) {
    try {
      const result = await this.client.get(key);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

export default CacheService;
