import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
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
import { CommentService } from './comment/comment.service';
import { CompetitionService } from './competition/competition.service';
import CommentDto from './dto/comment.dto';
import { CompetitionDto } from './dto/competition.dto';
import IdDto from './dto/id.dto';
import { MemeDto } from './dto/meme.dto';
import SubmissionDto from './dto/submission.dto';
import { AuthenticatedRequest } from './interface';
import { MemeService } from './meme/meme.service';
import { SubmissionService } from './submission/submission.service';
import MemeMediaFileValidator from './validator/meme-media-file.validator';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly app: AppService,
    private readonly meme: MemeService,
    private readonly competition: CompetitionService,
    private readonly comment: CommentService,
    private readonly submission: SubmissionService,
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

  @Post('meme/:id/comment')
  @UseGuards(AuthGuard)
  postComment(
    @Param() { id }: IdDto,
    @Body() comment: CommentDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    return this.comment.create({
      ...comment,
      createdById: user.id,
      memeId: id,
    });
  }

  @Get('meme/:id/comment')
  getComment(@Param() { id }: IdDto) {
    return this.comment.getByMemeId(id);
  }

  @Post('competition')
  @UseGuards(AuthGuard)
  createCompetition(
    @Body() competition: CompetitionDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    return this.competition.create({
      ...competition,
      creator: user,
    });
  }

  @Get('competition')
  getCompetition() {
    return this.competition.findMany({
      include: { curators: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('compeition/:id/meme')
  getCompeitionMemes(@Param() { id }: IdDto) {
    return this.meme.getByCompetitionId(id);
  }

  @Post('submission')
  postSubmission(
    @Body() submission: SubmissionDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    //@next validation for if user can submit this meme / maxUserSubmissions
    return this.submission.create({ data: { ...submission } });
  }
}
