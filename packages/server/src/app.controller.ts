import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { CompetitionService } from './competition/competition.service';
import SubmissionDto from './dto/submission.dto';
import { AuthenticatedRequest } from './interface';
import { MediaService } from './media/media.service';
import { MemeService } from './meme/meme.service';
import { ProfileService } from './profile/profile.service';
import { StatsService } from './stats/stats.service';
import { SubmissionService } from './submission/submission.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly app: AppService,
    private readonly meme: MemeService,
    private readonly competition: CompetitionService,
    private readonly submission: SubmissionService,
    private readonly profile: ProfileService,
    private readonly stats: StatsService,
  ) {}

  @Get()
  getIndex(): string {
    return this.app.getIndex();
  }

  @UseGuards(AuthGuard)
  @Get('user')
  getUser(@Req() { user }: AuthenticatedRequest) {
    return user;
  }

  @Get('media/requirements')
  getMediaRequirements() {
    const mimeTypeToExtensionMap = {};
    MediaService.supportedMedia.forEach((item) => {
      const extension = item.extension;
      if (Array.isArray(extension)) {
        mimeTypeToExtensionMap[item.mimeType] = extension;
      } else {
        mimeTypeToExtensionMap[item.mimeType] = [extension];
      }
    });
    return {
      maxSizeBytes: MediaService.MAX_SIZE_MEDIA_BYTES,
      mimeTypeToExtensionMap,
    };
  }

  @Post('submission')
  @UseGuards(AuthGuard)
  async postSubmission(
    @Body() submission: SubmissionDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    if (!(await this.meme.getMemeBelongsToUser(submission.memeId, user.id))) {
      throw new BadRequestException('Meme not found');
    }

    if (
      !(await this.competition.getIsCompetitionActive(submission.competitionId))
    ) {
      throw new BadRequestException('Competition not active');
    }

    if (
      await this.competition.getIsCompetitionCreatedByUser(
        submission.competitionId,
        user.id,
      )
    ) {
      throw new BadRequestException("You can't submit to your own competition");
    }

    const competition = await this.competition.findFirst({
      where: { id: submission.competitionId },
    });
    if (!competition) {
      throw new BadRequestException('Competition not found');
    }

    const userSubmissions = await this.submission.findMany({
      where: { createdById: user.id, competitionId: competition.id },
    });
    if (competition.maxUserSubmissions === userSubmissions.length) {
      throw new BadRequestException(
        'You can not submit more memes to this competiion',
      );
    }

    return this.submission.create({
      data: { ...submission, createdById: user.id },
    });
  }

  @Get('profile/:addressOrEns')
  async getProfile(@Param() { addressOrEns }: { addressOrEns: string }) {
    return this.profile.get(addressOrEns);
  }

  @Get('stats')
  getStats() {
    return this.stats.get();
  }
}
