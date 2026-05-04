import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'kpss_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Geliştirme ortamı için, production'da false yapılmalı
    }),
    DatabaseModule,
    AuthModule,
    SubjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
