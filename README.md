# Slooze — Premium Food SaaS Platform

Slooze is a production-ready, multi-role Food SaaS platform designed with a high-end "Warm Neutral" aesthetic. It features a robust architecture supporting multiple countries with strict Role-Based Access Control (RBAC) and data isolation.

## 🚀 Overview
The platform allows users to browse restaurants, explore menus, and manage orders. Security and data integrity are central to the design, ensuring that users can only interact with resources belonging to their assigned country and role.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS v4, Lucide React.
- **Backend API**: GraphQL (Apollo Server) integrated via Next.js Route Handlers.
- **Data Layer**: Prisma ORM with SQLite (for demonstration).
- **Authentication**: JWT-based session management with Bcrypt password hashing.
- **Styling**: Modern "Warm Neutral Food SaaS" theme with full Dark Mode support.

## ⚙️ Setup Instructions

### 1. Prerequisite Environments
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secure-secret-key"
NEXT_PUBLIC_GRAPHQL_URI="http://localhost:3000/api/graphql"
```

### 2. Database Initialization
Install dependencies and prepare the database:
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 3. Running the Application
```bash
# Development Mode
npm run dev

# Production Build
npm run build
npm run start
```

## 👥 Seeded Users
| Role | Email | Password | Country |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` | USA |
| **Manager (IN)** | `manager.in@example.com` | `password123` | INDIA |
| **Member (IN)** | `member.in@example.com` | `password123` | INDIA |
| **Manager (US)** | `manager.us@example.com` | `password123` | USA |
| **Member (US)** | `member.us@example.com` | `password123` | USA |

## 🛡️ Security & Access Control

### Role-Permission Matrix
| Feature | Member | Manager | Admin |
| :--- | :---: | :---: | :---: |
| Browse Restaurants/Menus | ✅ | ✅ | ✅ |
| Add to Cart / Place Order | ✅ | ✅ | ✅ |
| Checkout & Payments | ✅ | ✅ | ✅ |
| Manage Staff Orders | ❌ | ✅ | ✅ |
| Edit Payment Methods | ❌ | ❌ | ✅ |

### Country-Based Isolation
Data access is restricted by the `Country` flag on both the user and the resource. 
- **Enforcement**: This is handled at the **GraphQL Resolver level** using a `checkCountry` middleware utility.
- **Result**: A user in India cannot browse restaurants in the USA, nor can a USA Manager access Indian order documents.

### Identity Design
- **JWT**: Tokens are signed on the server and verified for every request via the Apollo Context.
- **Encryption**: Passwords are never stored in plain text; Bcrypt hashing (salt rounds: 10) is applied before storage.

## 🧪 How to Test
1. **Login as Member (India)**: 
   - Navigate to **Restaurants**. You should only see Indian restaurants (e.g., Curry House).
   - Add items to your **Cart** and proceed to **Dashboard** to see your current activity.
2. **Switch to Manager (USA)**:
   - Verify that the **Restaurants** list now displays USA-specific entries (e.g., Burger King).
   - Attempting to access an Indian restaurant ID via URL will result in a "Forbidden" GraphQL error.
3. **Verify Admin Access**:
   - Log in as the Admin (USA).
   - Access the **Payments** section to view and manage billing information (Access is restricted for other roles).

