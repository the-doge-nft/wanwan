import { Controller, Get, Logger, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users')
  async getUsers() {
    return this.userService.findMany();
  }

  @Get('/test')
  async getTest(@Session() session: any) {
    console.log(session);
    return { success: true };
  }
}
