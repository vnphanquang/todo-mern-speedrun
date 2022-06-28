import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskDao } from './task.dao';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskDao: TaskDao) {}

  @Get()
  all() {
    return this.taskDao.all();
  }

  @Post()
  create(@Body() data: Prisma.TaskCreateInput) {
    return this.taskDao.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.TaskUpdateInput) {
    return this.taskDao.update(parseInt(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskDao.delete(parseInt(id));
  }
}
