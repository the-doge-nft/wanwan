import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterService {
  constructor(private readonly config: ConfigService) {}
}
