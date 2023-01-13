import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ObjectSchema } from 'joi';
import SearchDto from 'src/dto/search.dto';
import { PrismaService } from './../prisma.service';
import QueryBuilder from './query-builder';

export interface Filter<T> {
  key: keyof T | string;
  value: string | boolean | number | (object | string | null)[];
  operation: string;
}

@Injectable()
export abstract class Search<T, K extends object> {
  static CONFIG_KEY = 'search';
  static PAGE_SIZE_KEY = 'count';
  static OFFSET_KEY = 'offset';

  constructor(private readonly prisma: PrismaService) {}

  protected modelName: keyof PrismaClient;
  protected guardedNames: (keyof T | string)[] = [];
  protected keyNames: (keyof T | string)[] = [];
  protected customKeyNames: (keyof T | string)[] = [];
  protected validationSchema: ObjectSchema;

  private takeDefault = 20;
  private offsetDefault = 0;

  public async searchOrFail() {
    return new Promise(() => {});
  }

  private getSearchConfig(query: SearchDto) {
    const search = query[Search.CONFIG_KEY];
    // const jsonSearch = this
  }

  private decodeBase64(value: string) {
    return JSON.parse(Buffer.from(value, 'base64').toString());
  }

  private encodeBase64(obj: object) {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  }

  protected abstract onCustomKeyFilter(
    filter: Filter<T>,
    builder: QueryBuilder<T, K>,
  ): void;
}
