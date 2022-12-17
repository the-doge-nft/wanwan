import { FileValidator } from '@nestjs/common';
import { MediaService } from '../media/media.service';

export default class MemeMediaFileValidator extends FileValidator {
  supportedMediaMimeTypes = MediaService.supportedMedia.map(
    (item) => item.mimeType,
  );
  constructor() {
    super({});
  }
  isValid(file?: any): boolean | Promise<boolean> {
    return this.supportedMediaMimeTypes.includes(file.mimetype);
  }
  buildErrorMessage(file: any): string {
    return `Invalid mimetype. Only the following are accepted: ${this.supportedMediaMimeTypes.join(
      ', ',
    )}`;
  }
}
