import { ValidationPipe } from '@nestjs/common';

const getValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    transform: true,
  });

export default getValidationPipe;
