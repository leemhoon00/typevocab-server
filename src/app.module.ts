import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
// import { FoldersModule } from './folders/folders.module';
// import { VocabulariesModule } from './vocabularies/vocabularies.module';
// import { WordsModule } from './words/words.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    // FoldersModule,
    // VocabulariesModule,
    // WordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
