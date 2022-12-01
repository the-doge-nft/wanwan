import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'TTEEESSSTT';
  }
  getTest() {
    return 'another test yo';
  }
  thing() {
    return 'thing';
  }
}
