export * from './services/index';
// export * from './generated/prisma';
export { PrismaClient, Prisma } from '@tellme/database/client';
export * from './repository/index';
export * from './utils/prisma-error.handle';