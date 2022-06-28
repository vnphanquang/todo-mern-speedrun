import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/services/prisma';

@Injectable()
export class TaskDao {
  constructor(private readonly prisma: PrismaService) {}

  byId(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  all() {
    return this.prisma.task.findMany();
  }

  create(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({
      data,
    });
  }

  update(id: number, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
