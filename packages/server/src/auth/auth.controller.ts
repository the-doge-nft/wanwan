import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { EthersService } from './../ethers/ethers.service';
import { UserService } from './../user/user.service';

import {
  Body,
  Post,
  Session as SessionDeco,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from 'express-session';
import { SiweMessage, generateNonce } from 'siwe';
import { SiweDto } from '../dto/siwe.dto';
import { InvalidNonceError } from '../error/InvalidNonce.error';
import { AuthGuard } from './auth.guard';

export type SessionType = Session & {
  nonce: string;
  siwe: any;
  oauth_token_secret?: string;
};

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly user: UserService,
    private readonly ethers: EthersService,
  ) {}

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

      const ens = await this.ethers.refreshEnsCache(address);

      return this.user.upsert({
        where: { address },
        update: { lastAuthedAt: new Date(), ens },
        create: {
          lastAuthedAt: new Date(),
          address,
          ens: ens as string | null,
        },
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

  @Get('status')
  getAuthStatus(@SessionDeco() session: SessionType) {
    return !!session?.siwe?.address;
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async postLogout(@SessionDeco() session: SessionType) {
    return new Promise((resolve) => {
      session.destroy(() => {
        this.logger.log('SESSION DESTROYED');
        resolve({ success: true });
      });
    });
  }
}
