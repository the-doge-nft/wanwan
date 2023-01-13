import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import SearchDto from 'src/dto/search.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CommentService } from '../comment/comment.service';
import CommentDto from '../dto/comment.dto';
import IdDto from '../dto/id.dto';
import { MemeDto } from '../dto/meme.dto';
import { AuthenticatedRequest } from '../interface';
import { MediaService } from '../media/media.service';
import MemeMediaFileValidator from '../validator/meme-media-file.validator';
import { MemeSearchService } from './meme-search.service';
import { MemeService } from './meme.service';

@Controller('meme')
export class MemeController {
  constructor(
    private readonly meme: MemeService,
    private readonly comment: CommentService,
    private readonly search: MemeSearchService,
  ) {}

  @Post('/')
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
    return this.meme.create(file, { ...meme, createdById: user.id });
  }

  @Get('/')
  getMeme() {
    return this.meme.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Get('search')
  getCompetitionSearch(@Query() config: SearchDto, @Req() req: Request) {
    console.log('hit');
    return this.search.searchOrFail(config, req).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  @Get(':id')
  async getMemeById(@Param() { id }: IdDto) {
    return this.meme.findFirst({ where: { id } });
  }

  @Post(':id/comment')
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

  @Get(':id/comment')
  getComment(@Param() { id }: IdDto) {
    return this.comment.getByMemeId(id);
  }
}
