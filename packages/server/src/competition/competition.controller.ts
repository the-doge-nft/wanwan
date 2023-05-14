import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RewardStatus } from '@prisma/client';
import { Request } from 'express';
import { CronJobs } from 'src/app.service';
import { MediaService } from 'src/media/media.service';
import MemeMediaFileValidator from 'src/validator/meme-media-file.validator';
import { AlchemyService } from '../alchemy/alchemy.service';
import { AuthGuard } from '../auth/auth.guard';
import { CompetitionDto } from '../dto/competition.dto';
import IdDto from '../dto/id.dto';
import { MemeIdDto } from '../dto/memeId.dto';
import SearchDto from '../dto/search.dto';
import UpdateReward from '../dto/updateReward.dto';
import VoteDto from '../dto/vote.dto';
import { AuthenticatedRequest } from '../interface';
import { RewardService } from '../reward/reward.service';
import { VoteService } from '../vote/vote.service';
import { MemeService } from './../meme/meme.service';
import { CompetitionSearchService } from './competition-search.service';
import { CompetitionService } from './competition.service';

@Controller('competition')
export class CompetitionController {
  private readonly logger = new Logger(CompetitionController.name);
  constructor(
    private readonly competition: CompetitionService,
    private readonly meme: MemeService,
    private readonly vote: VoteService,
    private readonly alchemy: AlchemyService,
    private readonly search: CompetitionSearchService,
    private readonly reward: RewardService,
    private readonly scheduler: SchedulerRegistry,
  ) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async postCompetition(
    @Body() competition: CompetitionDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    return this.competition
      .create({
        ...competition,
        creator: user,
      })
      .catch((e) => {
        throw new BadRequestException(e.message);
      });
  }

  @Post('/:id/cover')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor(MediaService.FILE_NAME, {
      dest: MediaService.FILE_UPLOAD_PATH,
    }),
  )
  async postCoverImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MemeMediaFileValidator(),
          new MaxFileSizeValidator({
            maxSize: MediaService.MAX_SIZE_MEDIA_BYTES,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() { user }: AuthenticatedRequest,
    @Param() { id }: IdDto,
  ) {
    return this.competition.updateCoverImage(file, id, user);
  }

  @Get('/')
  getCompetition() {
    return this.competition.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('search')
  getCompetitionSearch(@Query() config: SearchDto, @Req() req: Request) {
    return this.search.searchOrFail(config, req).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  @Get(':id')
  getCompetitionById(@Param() { id }: IdDto) {
    try {
      return this.competition.findFirstOrFail({ where: { id } });
    } catch (e) {
      throw new BadRequestException('Competition not found');
    }
  }

  @Get(':id/meme')
  getCompetitionMemes(@Param() { id }: IdDto) {
    return this.meme.getByCompetitionId(id);
  }

  @Get(':id/voteReason')
  @UseGuards(AuthGuard)
  async getUserVoteReason(
    @Param() { id }: IdDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    return this.competition.getVoteReason(user.address, id);
  }

  @Post(':id/vote')
  @UseGuards(AuthGuard)
  async postVote(
    @Body() vote: VoteDto,
    @Req() { user }: AuthenticatedRequest,
    @Param() { id: competitionId }: IdDto,
  ) {
    if (!(await this.competition.getIsCompetitionActive(competitionId))) {
      throw new BadRequestException('Competition has ended');
    }

    if (!(await this.competition.getCanUserVote(user.address, competitionId))) {
      throw new BadRequestException('You cannot vote for this competition');
    }

    return this.vote.vote({
      ...vote,
      competitionId,
      createdById: user.id,
    });
  }

  @Get(':id/meme/submissions')
  @UseGuards(AuthGuard)
  async getCanVote(
    @Param() { id }: IdDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    return this.meme.getSubmittedByCompetitionId(id, user.address);
  }

  @Get(':id/meme/ranked')
  async getRankedMemes(@Param() { id }: IdDto) {
    return this.meme.getRankedMemesByCompetitionId(id);
  }

  @Post(':id/meme/submissions/curate')
  @UseGuards(AuthGuard)
  async postCurateMeme(
    @Param() { id }: IdDto,
    @Req() { user }: AuthenticatedRequest,
    @Body() { memeId }: MemeIdDto,
  ) {
    if (!(await this.competition.getIsCompetitionActive(id))) {
      throw new BadRequestException('Competition has ended');
    }

    const curators = await this.competition.getCurators(id);
    const curatorIds = curators.map((user) => user.id);
    if (!curatorIds.includes(user.id)) {
      throw new BadRequestException(
        'You are not a curator of this competition',
      );
    }
    return this.competition.hideMemeSubmission(id, memeId);
  }

  @Post('/reward/:id/confirmed')
  @UseGuards(AuthGuard)
  async updateReward(
    @Body() { txId }: UpdateReward,
    @Param() { id }: IdDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    const reward = await this.getRewardForActiveCompetition({
      createdById: user.id,
      rewardId: id,
    });

    try {
      await this.reward.getIsRewardTxValid(reward.id, txId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const updateReward = await this.reward.update({
      where: { id: id },
      data: { txId, status: RewardStatus.CONFIRMED },
    });
    return this.reward.findFirst({ where: { id: updateReward.id } });
  }

  @Post('/reward/:id/confirming')
  @UseGuards(AuthGuard)
  async updateRewardConfirming(
    @Body() { txId }: UpdateReward,
    @Param() { id }: IdDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    const reward = await this.getRewardForActiveCompetition({
      createdById: user.id,
      rewardId: id,
    });

    const updatedReward = await this.reward.update({
      where: { id: reward.id },
      data: { status: RewardStatus.CONFIRMING, txId },
    });

    const job = await this.scheduler.getCronJob(
      CronJobs.VALIDATE_CONFIRMING_REWARDS,
    );
    job.start();
    return this.reward.findFirst({ where: { id: updatedReward.id } });
  }

  private async getRewardForActiveCompetition({ createdById, rewardId }: any) {
    const competition = await this.competition.findFirst({
      where: { rewards: { some: { id: rewardId } }, createdById: createdById },
    });
    if (!competition) {
      throw new BadRequestException('Competition not found');
    }

    if (await this.competition.getIsCompetitionActive(competition.id)) {
      throw new BadRequestException(
        'Competition is active, must wait until inactive to update rewards',
      );
    }

    const reward = await this.reward.findFirst({
      where: { id: rewardId, competitionId: competition.id },
    });
    if (!reward) {
      throw new BadRequestException('Reward not found');
    }
    return reward;
  }
}
