# System Architecture

## Overview
Slooze is built as a unified Next.js application that encapsulates both a robust React frontend and a GraphQL-based backend. This monolithic approach ensures seamless type safety, simplified deployment, and high performance for a food-tech SaaS product.

## Tech Stack
### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4 using the `@theme` architecture.
- **State Management**: React Context (Cart & Authentication).
- **Client**: Apollo Client for GraphQL data fetching and caching.

### Backend (API Layer)
- **API Model**: GraphQL (Apollo Server).
- **Route Handling**: Next.js 15 Route Handlers (`GET`/`POST`).
- **ORM**: Prisma for type-safe database access.
- **Security**: JWT (JSON Web Tokens) for stateless authentication.
- **Database**: SQLite (initialized for local development).

## Folder Structure
```text
src/
├── app/            # Next.js App Router (Pages, Layouts, API Route Handlers)
├── components/     # UI Components (Atomic Design with Shadcn UI)
├── context/        # React Context Providers (Auth, Cart)
├── lib/            # Shared logic (Prisma, Apollo, Auth, Utils)
└── middleware.ts   # Edge runtime auth redirection
prisma/
└── seed.ts         # Database initialization and mock data
docs/               # Project documentation
```

## Request Flow
The application follows a secure, request-response cycle for all data-driven interactions:

1. **Authentication**: Client logs in via the `login` mutation, receiving a JWT stored in a `next-auth` style cookie.
2. **Request Initiation**: All subsequent GraphQL queries/mutations include a `Bearer` token in the `Authorization` header.
3. **API Context**: The GraphQL Route Handler (`src/app/api/graphql/route.ts`) extracts the token, verifies the signature, and injects the `user` object into the Apollo context.
4. **Guards (Resolvers)**: Resolvers invoke internal guard utilities (`getUser`, `checkRole`, `checkCountry`) to enforce security policies.
5. **Data Layer**: Prisma ORM executes the query against the database.
6. **Response**: The server returns a structured JSON-LD response to the Apollo Client.

## Design Decisions
### Why Next.js + Apollo Server?
- **Next.js** provides a production-grade framework with excellent image optimization, edge-ready middleware, and a simplified deployment path on Vercel.
- **Apollo Server** within a Route Handler allows for a single endpoint (`/api/graphql`) to serve complex, nested data requirements, significantly reducing over-fetching while providing a self-documenting schema.

### Deployment-Ready Posture
While initialized with SQLite for local development, the system is designed to be deployment-ready. The Prisma schema can be pivoted to a managed PostgreSQL or MySQL instance (like PlanetScale or Neon) simply via environment variables, without changing the application logic.
