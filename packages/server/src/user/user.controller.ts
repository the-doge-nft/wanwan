import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from '../interface';
import { AuthGuard } from './../auth/auth.guard';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('')
  getUser(@Req() { user }: AuthenticatedRequest) {
    return { user };
  }
}
