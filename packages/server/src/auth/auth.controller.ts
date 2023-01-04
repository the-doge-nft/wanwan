import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './../user/user.service';

import {
  Body,
  Post,
  Session as SessionDeco,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from 'express-session';
import { generateNonce, SiweMessage } from 'siwe';
import { SiweDto } from '../dto/siwe.dto';
import { InvalidNonceError } from '../error/InvalidNonce.error';
import { AuthGuard } from './auth.guard';

type SessionType = Session & { nonce: string; siwe: any };

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly user: UserService) {}

  @Get('nonce')
  async getNonce(@SessionDeco() session: SessionType) {
    session.nonce = generateNonce();
    return {
      nonce: session.nonce,
    };
  }

  @Post('login')
  async postAuth(
    @Body() { message, signature }: SiweDto,
    @SessionDeco() session: SessionType,
  ) {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.validate(signature);
      if (fields.nonce !== session.nonce) {
        throw new InvalidNonceError();
      }
      session.siwe = fields;
      const { address } = session.siwe;

      // @next -- we need to expire the cookie at some point
      // session.cookie.expires = new Date(fields.expirationTime);

      return this.user.upsert({
        where: { address },
        update: { lastAuthedAt: new Date() },
        create: { lastAuthedAt: new Date(), address },
      });
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

  @Get('isLoggedIn')
  getAuthStatus(@SessionDeco() session: SessionType) {
    return !!session?.siwe?.address;
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async postLogout(@SessionDeco() session: SessionType) {
    return new Promise((resolve) => {
      session.destroy(() => resolve({ success: true }));
    });
  }
}
