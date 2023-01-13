import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const merge = require('lodash.merge');

export interface GenericFindManyArgs {
  select?: any;
  include?: any;
  where?: any;
  orderBy?: any | any[];
  cursor?: any;
  take?: any;
  skip?: any;
  distinct?: any;
}

const client = new PrismaClient();

@Injectable()
class QueryBuilder<T, K extends GenericFindManyArgs> {
  protected prisma: PrismaClient;
  private _filters: Pick<K, 'where'>;
  private _sorts: any = [];
  private _includes: Pick<K, 'include'>;
  private _take: number;
  private _offset: number;

  // todo: fix keyof PrismaClient - confine to a model name
  constructor(private model: keyof PrismaClient) {
    this.prisma = client;
  }

  // todo: fix typings
  where(key: keyof NonNullable<K['where']>, thing: object | null) {
    this._filters = merge(this._filters, { [key]: thing });
  }

  // todo: fix typings
  orderBy(key: keyof (NonNullable<K['orderBy']> | any), direction: any) {
    this._sorts.push({ [key]: direction });
  }

  // todo: fix typings
  include(key: keyof NonNullable<K['include']>, more: any) {
    this._includes = merge(this._includes, { [key]: more });
  }

  paginate(take: number, offset: number) {
    this._take = take;
    this._offset = offset;
    return this;
  }

  async getAll(): Promise<T[]> {
    const config = {
      where: this._filters ? this._filters : undefined,
      include: this._includes ? this._includes : undefined,
      orderBy: this._sorts ? this._sorts : undefined,
      take: this._take ? this._take : undefined,
      skip: this._offset ? this._offset : undefined,
    };

    console.log(
      'debug:: querying with the following config',
      JSON.stringify(config, undefined, 2),
    );
    //@ts-ignore
    return this.prisma[this.model].findMany(config);
  }
}

export default QueryBuilder;
