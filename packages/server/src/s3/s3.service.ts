import * as AWS from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './../config/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private client: AWS.S3;
  constructor(private readonly config: ConfigService<Config>) {
    const awsConfig = this.config.get<Config['aws']>('aws');
    this.client = new AWS.S3({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKey,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async putObject({
    bucket,
    key,
    body,
  }: {
    bucket: string;
    key: string;
    body: AWS.PutObjectCommandInput['Body'];
  }) {
    try {
      const data = await this.client.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }),
      );
      this.logger.log(`uploaded: ${bucket}::${key}`);
      return data;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
