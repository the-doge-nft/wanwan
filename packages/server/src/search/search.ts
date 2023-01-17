import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ObjectSchema } from 'joi';
import SearchDto from 'src/dto/search.dto';
import QueryBuilder from './query-builder';

export interface Filter<T> {
  key: keyof T | string;
  value: string | boolean | number | (object | string | null)[];
  operation: string;
}

export interface Sort<T> {
  key: keyof T | string;
  direction: 'asc' | 'desc';
}

// next -- better type safety
@Injectable()
export abstract class Search<T, K extends object> {
  static CONFIG_KEY = 'config';
  static PAGE_SIZE_KEY = 'count';
  static OFFSET_KEY = 'offset';

  protected modelName: keyof PrismaClient;
  protected guardedNames: (keyof T | string)[] = [];
  protected keyNames: (keyof T | string)[] = [];
  protected customKeyNames: (keyof T | string)[] = [];
  protected validationSchema: ObjectSchema;

  private takeDefault = 20;
  private offsetDefault = 0;
  private validFilterOperations = [
    'in',
    'notIn',
    'contains',
    'startsWith',
    'endsWith',
    'not',
  ];

  public async searchOrFail(query: SearchDto, req: Request) {
    const { filters, sorts } = this.getSearchConfig(query);
    const take = query?.count ? query.count : this.takeDefault;
    const offset = query?.offset ? query.offset : this.offsetDefault;
    const data = await this.search(filters, sorts, take, offset);

    let nextQueryParam,
      next = null;
    if (data.length === take) {
      const encodedConfig = this.encodeBase64({ filters, sorts });
      nextQueryParam = `?${Search.CONFIG_KEY}=${encodedConfig}&${
        Search.PAGE_SIZE_KEY
      }=${take}&${Search.OFFSET_KEY}=${offset + take}`;
      //@ts-ignore
      next = `${req.baseUrl}${req._parsedUrl.pathname}${nextQueryParam}`;
    }
    return {
      data,
      next,
    };
  }

  private getSearchConfig(query: SearchDto): {
    filters: Filter<T>[];
    sorts: Sort<T>[];
  } {
    const search = query[Search.CONFIG_KEY];
    const json = this.decodeBase64(search);

    const test = this.validationSchema.validate(json);
    if (test.error) {
      throw new Error(JSON.stringify(test.error));
    }
    return test.value;
  }

  private async search(
    filters: Filter<T>[] = [],
    sorts: Sort<T>[] = [],
    take: number,
    offset: number,
  ) {
    const builder = new QueryBuilder<T, K>(this.modelName);

    filters.forEach((filter) => {
      const key = filter.key as any;
      if (this.keyNames.includes(key)) {
        if (this.validFilterOperations.includes(filter.operation)) {
          builder.where(key, {
            [filter.operation]: filter.value,
            mode: 'insensitive',
          });
        } else {
          builder.where(key, { [filter.operation]: filter.value });
        }
      } else if (this.customKeyNames.includes(filter.key)) {
        this.onCustomKeyFilter(filter, builder);
      } else if (this.guardedNames.includes(filter.key)) {
        throw new Error(`Key ${key} is not filterable`);
      } else {
        throw new Error('Key name not supported');
      }
    });

    sorts.forEach((sort) => {
      const key = sort.key as string;
      if (this.keyNames.includes(key)) {
        builder.orderBy(sort.key, sort.direction);
      } else if (this.customKeyNames.includes(key)) {
        this.onCustomKeySort(sort, builder);
      } else if (this.guardedNames.includes(key)) {
        throw new Error(`Key ${key} is not sortable`);
      }
    });

    this.beforeGetAll(builder);
    return this.afterGetAll(await builder.paginate(take, offset).getAll());
  }

  private decodeBase64(value: string) {
    return JSON.parse(Buffer.from(value, 'base64').toString());
  }

  private encodeBase64(obj: object) {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  }

  protected beforeGetAll(builder: QueryBuilder<T, K>) {
    return;
  }

  protected afterGetAll(results: T[]) {
    return results;
  }

  protected abstract onCustomKeyFilter(
    filter: Filter<T>,
    builder: QueryBuilder<T, K>,
  ): void;

  protected abstract onCustomKeySort(
    sort: Sort<T>,
    builder: QueryBuilder<T, K>,
  ): void;
}
