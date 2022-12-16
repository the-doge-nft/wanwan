import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { MemeDto } from './dto/meme.dto';
import { AuthenticatedRequest } from './interface';
import { MediaService } from './media/media.service';
import { MemeService } from './meme/meme.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly app: AppService,
    private readonly meme: MemeService,
  ) {}

  @Get()
  getHello(): string {
    return this.app.getHello();
  }

  @Post('meme')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/',
      fileFilter: (req, file, cb) => {
        if (MediaService.supportedMediaMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(), false);
        }
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() meme: MemeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.meme.create(file, { ...meme, createdById: req.user.id });
  }
}
