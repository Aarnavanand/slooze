import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Use a proxy to lazy-initialize the Prisma client only when first accessed.
// This prevents database connection attempts during the Next.js build/static analysis phase.
const prisma = new Proxy({} as PrismaClient, {
    get(target, prop, receiver) {
        if (!globalForPrisma.prisma) {
            globalForPrisma.prisma = new PrismaClient();
        }
        return Reflect.get(globalForPrisma.prisma, prop, receiver);
    }
});

export default prisma;
