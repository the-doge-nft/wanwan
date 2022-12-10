import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';
import { AppService } from './app.service';
import { SiweDto } from './dto/siwe.dto';
import { InvalidNonceError } from './error/InvalidNonce.error';
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

  @Post('/auth/verify')
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
      console.error(e);
      switch (e) {
        case InvalidNonceError:
          throw new UnauthorizedException(e.message);
        default:
          throw new UnauthorizedException();
      }
    }
    return { success: true };
  }

  @Get('/auth/nonce')
  async getNonce(@Session() session: any) {
    session.nonce = generateNonce();
    return {
      nonce: session.nonce,
    };
  }
}
