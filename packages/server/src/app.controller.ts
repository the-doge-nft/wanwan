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

type SessionType = Session & { nonce: string; siwe: any };

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

  @Get('/auth/nonce')
  async getNonce(@_Session() session: SessionType) {
    session.nonce = generateNonce();
    return {
      nonce: session.nonce,
    };
  }

  @Post('/auth/verify')
  async postAuth(
    @Body() { message, signature }: SiweDto,
    @_Session() session: SessionType,
  ) {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.validate(signature);

      if (fields.nonce !== session.nonce) {
        throw new InvalidNonceError();
      }
      session.siwe = fields;
      // session.cookie.expires = new Date(fields.expirationTime);
      console.log('/auth/verify session', session);
      return { success: true, session };
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

  @Get('/test')
  async getTest(@_Session() session: SessionType) {
    console.log('GET /test', session);
    return { success: true };
  }
}
