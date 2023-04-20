import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    this.logger.log(
      `Connecting to database: ${this.config.get('databaseUrl')}`,
    );
    try {
      await this.$connect();
      this.logger.log('Connected to database');
      this.logger.log('resetting sequences');
      await this.ONLY_DO_THIS_ONCE();
      this.logger.log('sequences reset');
    } catch (e) {
      this.logger.error('Could not connect to database');
      this.logger.error(e);
    }
  }

  async ONLY_DO_THIS_ONCE() {
    await this
      .$executeRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id)+1, 1), false) FROM "User";`;
    await this
      .$executeRaw`SELECT setval(pg_get_serial_sequence('"Media"', 'id'), coalesce(max(id)+1, 1), false) FROM "Media";`;
    await this
      .$executeRaw`SELECT setval(pg_get_serial_sequence('"Meme"', 'id'), coalesce(max(id)+1, 1), false) FROM "Meme";`;
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
