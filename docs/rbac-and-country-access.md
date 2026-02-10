# RBAC and Country-Based Access Control

Security in Slooze is handled at both the UI and API levels to ensure a multi-tenant, multi-role "shared-nothing" experience between different regions.

## Role Definitions

| Role | Description |
| :--- | :--- |
| **ADMIN** | System administrator. Can manage payment methods and have broad visibility. |
| **MANAGER** | Regional manager. authorized to manage orders and view regional performance. |
| **MEMBER** | Standard customer. authorized to browse, order, and checkout. |

## Permission Matrix

| Feature | ADMIN | MANAGER | MEMBER |
| :--- | :---: | :---: | :---: |
| Browse Restaurants | ✅ | ✅ | ✅ |
| Create Order | ✅ | ✅ | ✅ |
| Checkout Order | ❌ | ❌ | ✅ |
| Cancel own Order | ✅ | ✅ | ✅ |
| Cancel Staff Orders | ✅ | ✅ | ❌ |
| Manage Payments | ✅ | ❌ | ❌ |

## Backend Enforcement

While the UI hides certain buttons and pages using the `useAuth()` hook, the true security is enforced in the **GraphQL Resolvers** (`src/app/api/graphql/resolvers.ts`).

### 1. AuthGuard (`getUser`)
Ensures the request contains a valid JWT. If the token is missing or expired, the server returns an `UNAUTHENTICATED` error before executing any logic.

### 2. RolesGuard (`checkRole`)
Restricts specific actions to authorized roles. 
*   **Example**: The `createPaymentMethod` mutation explicitly checks for `Role.ADMIN`. If a `MEMBER` attempts this via the API, a `FORBIDDEN` error is returned.

### 3. CountryGuard (`checkCountry`)
Enforces regional data isolation. In a Food SaaS context, pricing and logistics are country-specific.
*   **Implementation**: Users are assigned a `Country` (e.g., `INDIA`, `USA`). When querying `restaurants`, the resolver automatically filters based on the user's country stored in the JWT.
*   **Manual Protection**: If a user attempts to access a specific restaurant or order ID belonging to another country, the resolver throws a "Access restricted by country" error.

## Critical Scenarios

### Checkout Security
A `MEMBER` is the only role authorized to call `checkoutOrder`. This ensures that Managers or Admins cannot accidentally charge customer cards or process orders without direct customer intent.

### Cross-Country Restriction
If a user logged in with a `USA` profile attempts to fetch menu items for an `INDIA` restaurant (using a known ID), the system will:
1. Fetch the restaurant record via Prisma.
2. Compare the restaurant's country with the user's `context.user.country`.
3. Throw a `Forbidden` GraphQL error if they do not match.
