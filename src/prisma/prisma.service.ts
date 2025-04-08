import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'mongodb+srv://ripon:ripon@prismatest.pxm7kcx.mongodb.net/smt?retryWrites=true&w=majority&appName=prismaTest',
        },
      },
    });
  }
}
