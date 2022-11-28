import {
  CacheInterceptor,
  CacheKey,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @CacheKey('INDEX:TEST')
  @Get()
  getHello(): string {
    console.log('TEST TEST TEST');
    return this.appService.getHello();
  }
}
