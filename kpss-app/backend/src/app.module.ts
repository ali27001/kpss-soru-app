import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';
import { DailyStatsModule } from './daily-stats/daily-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Tüm modüllerde erişilebilir yapar
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', 'postgres'),
        database: configService.get<string>('DB_NAME', 'kpss_db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    SubjectsModule,
    DailyStatsModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  constructor() {
    console.log(`Veritabanı bağlantısı deneniyor: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
  }
}

