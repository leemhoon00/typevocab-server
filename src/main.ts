import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const client_url = configService.get<string>('CLIENT_URL');
  app.enableCors({
    origin: client_url,
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
