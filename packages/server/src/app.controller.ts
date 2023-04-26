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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlchemyService } from './alchemy/alchemy.service';
import { AppService } from './app.service';
import { ADMIN_ADDRESSES, AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { CompetitionService } from './competition/competition.service';
import ProfileDto from './dto/profile.dto';
import SubmissionDto from './dto/submission.dto';
import { EthersService } from './ethers/ethers.service';
import { AuthenticatedRequest } from './interface';
import { MediaService } from './media/media.service';
import { MemeService } from './meme/meme.service';
import { ProfileService } from './profile/profile.service';
import { StatsService } from './stats/stats.service';
import { SubmissionService } from './submission/submission.service';
import { UserService } from './user/user.service';
import MemeMediaFileValidator from './validator/meme-media-file.validator';

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
    private readonly users: UserService,
    private readonly media: MediaService,
    private readonly alchemy: AlchemyService,
    private readonly ethers: EthersService,
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

  @Post('media')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor(MediaService.FILE_NAME, {
      dest: MediaService.FILE_UPLOAD_PATH,
    }),
  )
  async uploadFile(
    @Req() { user }: AuthenticatedRequest,
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
  ) {
    const media = await this.media.create(file, user.id);
    return this.media.findFirst({ where: { id: media.id } });
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

  @UseGuards(AuthGuard)
  @Post('/profile')
  async postProfile(
    @Req() { user }: AuthenticatedRequest,
    @Body() profile: ProfileDto,
  ) {
    await this.users.update({ where: { id: user.id }, data: profile });
    return this.profile.get(user.address);
  }

  @Get('stats')
  getStats() {
    return this.stats.get();
  }

  @UseGuards(AuthGuard)
  @Post('/ens/resolveEns')
  async getEnsName(@Body() { ens }: { ens: string }) {
    const cache = await this.alchemy.resolveCachedEnsName(ens);
    if (cache) {
      return cache;
    }
    return this.alchemy.refreshResolveCachedEnsName(ens);
  }

  @UseGuards(AuthGuard)
  @Post('/ens/resolveName')
  async resolveName(@Body() { address }: { address: string }) {
    const cache = await this.ethers.getCachedEnsName(address);
    if (cache) {
      return cache;
    }
    return this.ethers.refreshEnsCache(address);
  }

  @UseGuards(AuthGuard)
  @Get('/wallet')
  async getWallet(@Req() { user }: AuthenticatedRequest) {
    const nft = await this.alchemy.getNftsForOwner(user.address);
    const erc20 = await this.alchemy.getTokenBalances(user.address);
    return { nft, erc20 };
  }

  @UseGuards(AuthGuard)
  @Get('/nft/:address/holders')
  getNftHolders(@Param() { address }: { address: string }) {
    return this.alchemy.getOwnersForConract(address);
  }

  @UseGuards(AuthGuard)
  @Get('/nft/:address')
  getNftForContract(@Param() { address }: { address: string }) {
    return this.alchemy.getNftsForContract(address);
  }

  @UseGuards(AuthGuard)
  @Get('/contract/:address')
  async getNftForContractAndToken(@Param() { address }: { address: string }) {
    const metadata = await this.alchemy.getERC20Metadata(address);
    const nft = await this.alchemy.getNftContractMetadata(address);
    console.log(metadata, nft);
  }

  @UseGuards(AdminGuard)
  @Get('/admin/tweet')
  async adminTweet() {
    return this.app.tweetMeme();
  }

  @Get('/admin/isAdmin')
  @UseGuards(AuthGuard)
  getIsAdmin(@Req() { user }: AuthenticatedRequest) {
    return ADMIN_ADDRESSES.includes(user.address);
  }
}
