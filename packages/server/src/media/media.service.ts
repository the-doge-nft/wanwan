import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';
import sizeOf from 'image-size';
import { join } from 'path';
import { Config } from '../config/config';
import { PrismaService } from './../prisma.service';
import { S3Service } from './../s3/s3.service';
@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly s3: S3Service,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Config>,
  ) {}

  static supportedMedia = [
    { extension: ['.jpeg', '.jpg'], mimeType: 'image/jpeg' },
    { extension: '.png', mimeType: 'image/png' },
    { extension: '.gif', mimeType: 'image/gif' },
    { extension: '.svg', mimeType: 'image/svg+xml' },
  ];
  // static supportedMediaMimeTypes = MediaService.supportedMedia.map(
  //   (item) => item.mimeType,
  // );
  // static supportedMimeTypeString =
  //   MediaService.supportedMediaMimeTypes.join(', ');

  async create(file: Express.Multer.File, createdById: number) {
    const bucket = this.config.get('aws').mediaBucketName;
    const key = `${createdById}-${file.filename}-${
      new Date().toISOString().split('T')[0]
    }.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`;

    await this.s3.putObject({
      body: file.stream,
      bucket,
      key,
    });

    const filePath =
      join(__dirname, '..', '..', file.destination) + file.filename;
    const dimensions = sizeOf(filePath);

    const media = await this.prisma.media.create({
      data: {
        width: dimensions.width,
        height: dimensions.height,
        filename: key,
        filesize: file.size,
        s3BucketName: bucket,
        createdById,
      },
    });

    // remove from the system
    await unlinkSync(filePath);
    return media;
  }
}
