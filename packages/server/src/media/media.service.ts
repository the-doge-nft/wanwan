import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import sizeOf from 'image-size';
import { PrismaService } from './../prisma.service';
import { S3Service } from './../s3/s3.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly s3: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  static supportedMedia = [
    { extension: ['.jpeg', '.jpg'], mimeType: 'image/jpeg' },
    { extension: '.png', mimeType: 'image/png' },
    { extension: '.gif', mimeType: 'image/gif' },
    { extension: '.svg', mimeType: 'image/svg+xml' },
  ];
  static supportedMediaMimeTypes = MediaService.supportedMedia.map(
    (item) => item.mimeType,
  );

  async create(file: Express.Multer.File, createdById: number) {
    const s3 = await this.s3.putObject({
      bucket: 'TEST',
      key: `${createdById}-${file.filename}-${new Date().toISOString()}`,
      body: file.stream,
    });
    const dimensions = sizeOf(file.destination);
    const media = await this.prisma.media.create({
      data: {
        width: dimensions.width,
        height: dimensions.height,
        filename: file.filename,
        filesize: file.size,
        s3BucketName: 'TEST',
        createdById,
      },
    });

    // remove from the system
    await fs.unlinkSync(file.destination);
    return media;
  }
}
