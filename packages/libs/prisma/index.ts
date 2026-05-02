import { PrismaClient } from '../../../generated/prisma';

declare global {
  // eslint-disable-next-line no-var
  var prismadb: PrismaClient | undefined;
}

const prisma = globalThis.prismadb ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismadb = prisma;
}

export default prisma;