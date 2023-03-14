import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private NULL = 'NULL';
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string) {
    const data = await this.cache.get<T>(key);
    return data === this.NULL ? null : data;
  }

  async set(key: string, value?: any, ttl?: number) {
    await this.cache.set(key, value === null ? this.NULL : value, { ttl });
    return this.get(key);
  }

  del(key: string) {
    return this.cache.del(key);
  }

  async getOrQueryAndCache<T>(
    key: string,
    getData: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const data = await this.get<T>(key);
    if (data) {
      return data;
    }
    const newData = await getData();
    await this.set(key, newData, ttl);
    return newData;
  }
}
