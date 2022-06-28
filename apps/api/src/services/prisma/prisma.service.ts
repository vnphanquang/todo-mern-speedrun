import { OnModuleInit } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(_app: INestApplication) {
    this.$on('beforeExit', async () => {
      console.log('Shutting down prisma...');
    });
  }
}
