import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DomainTaskModule } from './domains/task';

@Module({
  imports: [DomainTaskModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
