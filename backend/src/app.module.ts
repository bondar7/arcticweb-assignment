import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LeadsModule } from './leads/leads.module';
import { PrismaModule } from './prisma/prisma.module';
import { validateEnvironment } from './config/environment.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    PrismaModule,
    LeadsModule,
  ],
})
export class AppModule {}
