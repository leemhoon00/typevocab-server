import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const client_url = configService.get<string>('CLIENT_URL');
  app.enableCors({
    origin: client_url,
    credentials: true,
  });
  app.use(cookieParser());

  // swagger
  const config = new DocumentBuilder()
    .setTitle('TypeVocab API')
    .setDescription('TypeVocab API description')
    .setVersion('1.0')
    .addTag('typevocab')
    .addCookieAuth('jwt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
