import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AlchemyService } from '../alchemy/alchemy.service';
import { AuthGuard } from '../auth/auth.guard';
import { CompetitionDto } from '../dto/competition.dto';
import IdDto from '../dto/id.dto';
import SearchDto from '../dto/search.dto';
import VoteDto from '../dto/vote.dto';
import { AuthenticatedRequest } from '../interface';
import { VoteService } from '../vote/vote.service';
import { MemeService } from './../meme/meme.service';
import { CompetitionSearchService } from './competition-search.service';
import { CompetitionService } from './competition.service';

@Controller('competition')
export class CompetitionController {
  constructor(
    private readonly competition: CompetitionService,
    private readonly meme: MemeService,
    private readonly vote: VoteService,
    private readonly alchemy: AlchemyService,
    private readonly search: CompetitionSearchService,
  ) {}

  @Post('/')
  @UseGuards(AuthGuard)
  postCompetition(
    @Body() competition: CompetitionDto,
    @Req() { user }: AuthenticatedRequest,
  ) {
    return this.competition.create({
      ...competition,
      creator: user,
    });
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

    if (!(await this.alchemy.getIsPixelHolder(user.address))) {
      throw new BadRequestException('You must hold a pixel to vote');
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
    return this.meme.getRankedMemesByCompetition(id);
  }
}
