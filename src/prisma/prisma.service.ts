import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

const PrismaObjectGenerator = (config: ConfigService) => {
  const prismaObject = {
    datasources: {
      db: {
        url: config.get('DATABASE_URL'),
      },
    },
  };
  return prismaObject;
};

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super(PrismaObjectGenerator(config));
  }
}
