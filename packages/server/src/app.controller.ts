import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Session as _Session,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from 'express-session';
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
    @_Session() session: Session,
  ) {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.validate(signature);

      // @ts-ignore
      if (fields.nonce !== session.nonce) {
        throw new InvalidNonceError();
      }
      // @ts-ignore
      session.siwe = fields;
      session.cookie.expires = new Date(fields.expirationTime);
      return session.save(() => ({ success: true }));
    } catch (e) {
      this.logger.error(e);
      switch (e) {
        case InvalidNonceError:
          throw new UnauthorizedException(e.message);
        default:
          throw new UnauthorizedException();
      }
    }
  }

  @Get('/auth/nonce')
  async getNonce(@_Session() session: any) {
    session.nonce = generateNonce();
    return {
      nonce: session.nonce,
    };
  }

  @Get('/test')
  async getTest(@_Session() session: any) {
    console.log('app', session);
    return { success: true };
  }
}
