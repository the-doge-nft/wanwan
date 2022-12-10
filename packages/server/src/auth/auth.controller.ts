import { Controller, Get, Logger } from '@nestjs/common';

import {
  Body,
  Post,
  Session as _Session,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from 'express-session';
import { generateNonce, SiweMessage } from 'siwe';
import { SiweDto } from '../dto/siwe.dto';
import { InvalidNonceError } from '../error/InvalidNonce.error';

type SessionType = Session & { nonce: string; siwe: any };

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Get('/nonce')
  async getNonce(@_Session() session: SessionType) {
    session.nonce = generateNonce();
    return {
      nonce: session.nonce,
    };
  }

  @Post('/verify')
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
}
