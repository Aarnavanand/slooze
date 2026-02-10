import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { verifyToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const apolloHandler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        const user = token ? verifyToken(token) : null;
        return { user };
    },
});

export async function GET(request: NextRequest, context: { params: Promise<any> }) {
    return apolloHandler(request) as Promise<Response>;
}

export async function POST(request: NextRequest, context: { params: Promise<any> }) {
    return apolloHandler(request) as Promise<Response>;
}
