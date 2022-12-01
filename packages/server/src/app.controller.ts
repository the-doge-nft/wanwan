import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { SiweMessage } from 'siwe';
import { AppService } from './app.service';
import { SiweDto } from './dto/siwe.dto';
import { InvalidNonceError } from './error/InvalidNonce.error';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
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

  @Post('/auth')
  async postAuth(
    @Body() { message, signature }: SiweDto,
    @Session() session: any,
  ) {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.validate(signature);

      if (fields.nonce !== session.nonce) {
        throw new InvalidNonceError();
      }
      session.siwe = fields;
      session.cookie.expires = new Date(fields.expirationTime);
    } catch (e) {
      switch (e) {
        case InvalidNonceError:
          throw new UnauthorizedException(e.message);
        default:
          throw new UnauthorizedException();
      }
    }
    return { success: true };
  }
}
