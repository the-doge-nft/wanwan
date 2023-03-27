import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Media } from '@prisma/client';
import { readFileSync, unlinkSync } from 'fs';
import sizeOf from 'image-size';
import { join } from 'path';
import { Config } from '../config/config';
import { MediaWithExtras } from '../interface';
import { PrismaService } from './../prisma.service';
import { S3Service } from './../s3/s3.service';
@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private awsRegion: string;
  private getFileName(file: Express.Multer.File, createdById: number) {
    return `${createdById}-${file.filename}-${
      new Date().toISOString().split('T')[0]
    }.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`;
  }

  private getS3Url(media: Media) {
    // @next CDN
    // https://dev-meme-media.s3.us-east-2.amazonaws.com/1-0cd6cce944fddb2e285dca0acd8103c2-2023-01-06.jpeg
    return `https://${media.s3BucketName}.s3.${this.awsRegion}.amazonaws.com/${media.filename}`;
  }

  addExtra(item: Media): MediaWithExtras {
    return { ...item, url: this.getS3Url(item) };
  }

  private addExtras(media: Array<Media>) {
    return media.map((item) => this.addExtra(item));
  }
  constructor(
    private readonly s3: S3Service,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Config>,
  ) {
    this.awsRegion = this.config.get('aws').region;
  }

  static supportedMedia = [
    { extension: ['.jpeg', '.jpg'], mimeType: 'image/jpeg' },
    { extension: '.png', mimeType: 'image/png' },
    { extension: '.gif', mimeType: 'image/gif' },
    { extension: '.svg', mimeType: 'image/svg+xml' },
  ];

  static MAX_SIZE_MEDIA_BYTES = 5242880;

  async create(file: Express.Multer.File, createdById: number) {
    const bucket = this.config.get('aws').mediaBucketName;
    const filename = this.getFileName(file, createdById);
    const filePath =
      join(__dirname, '..', '..', '..', file.destination) + file.filename;
    const { width, height } = sizeOf(filePath);

    await this.s3.putObject({
      body: readFileSync(filePath),
      bucket,
      key: filename,
    });

    const media = await this.prisma.media.create({
      data: {
        filesize: file.size,
        s3BucketName: bucket,
        filename,
        createdById,
        width,
        height,
      },
    });

    // remove from the file system
    await unlinkSync(filePath);
    return media;
  }
}
