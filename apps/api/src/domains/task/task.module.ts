import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { TaskController } from './task.controller';
import { TaskDao } from './task.dao';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [PrismaService, TaskDao],
  exports: [],
})
export class DomainTaskModule {}
