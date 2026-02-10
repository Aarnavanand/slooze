import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { verifyToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

let apolloHandler: any;

async function getApolloHandler() {
    if (!apolloHandler) {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
        });
        apolloHandler = startServerAndCreateNextHandler<NextRequest>(server, {
            context: async (req) => {
                const token = req.headers.get('authorization')?.replace('Bearer ', '');
                const user = token ? verifyToken(token) : null;
                return { user };
            },
        });
    }
    return apolloHandler;
}

export async function GET(request: NextRequest, context: { params: Promise<any> }) {
    const handler = await getApolloHandler();
    return handler(request) as Promise<Response>;
}

export async function POST(request: NextRequest, context: { params: Promise<any> }) {
    const handler = await getApolloHandler();
    return handler(request) as Promise<Response>;
}
