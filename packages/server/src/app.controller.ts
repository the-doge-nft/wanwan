import {
  Body,
  Controller,
  Get,
  Logger,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { CompetitionService } from './competition/competition.service';
import { CompetitionDto } from './dto/competition.dto';
import { MemeDto } from './dto/meme.dto';
import { AuthenticatedRequest } from './interface';
import { MemeService } from './meme/meme.service';
import MemeMediaFileValidator from './validator/meme-media-file.validator';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly app: AppService,
    private readonly meme: MemeService,
    private readonly compeition: CompetitionService,
  ) {}

  @Get()
  getIndex(): string {
    return this.app.getIndex();
  }

  @Post('meme')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/',
    }),
  )
  uploadFile(
    @Body() meme: MemeDto,
    @Req() { user }: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipe({ validators: [new MemeMediaFileValidator()] }),
    )
    file: Express.Multer.File,
  ) {
    return this.meme.create(file, { ...meme, createdById: user.id });
  }

  @Post('competition')
  @UseGuards(AuthGuard)
  createCompetition(
    @Body() competition: CompetitionDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    return this.compeition.create({
      ...competition,
      creator: user,
    });
  }

  @Get('competition')
  getCompetition() {
    return this.compeition.findMany({
      include: { curators: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
