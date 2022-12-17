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
      // fileFilter: (req, file, cb) => {
      //   console.log(req.files);
      //   console.log(file);
      //   if (MediaService.supportedMediaMimeTypes.includes(file.mimetype)) {
      //     cb(null, true);
      //   } else {
      //     cb(
      //       new BadRequestException(
      //         `Invalid mimetype. Only the following are accepted: ${MediaService.supportedMimeTypeString}`,
      //       ),
      //       false,
      //     );
      //   }
      // },
    }),
  )
  uploadFile(
    @Body() meme: MemeDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipe({ validators: [new MemeMediaFileValidator()] }),
    )
    file: Express.Multer.File,
  ) {
    return this.meme.create(file, { ...meme, createdById: req.user.id });
  }
}
