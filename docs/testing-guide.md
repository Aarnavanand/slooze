# Testing Guide

This guide provides instructions on how to verify the system's core features across different user roles and security constraints.

## Local Setup
Ensure you have initialized the project correctly:
1. `npm install`
2. `npx prisma generate`
3. `npx prisma migrate dev`
4. `npm run seed`
5. `npm run dev`

## User Credentials (Seed Data)
For testing, use the following accounts. All accounts share the password: `password123`.

| Role | Email | Region |
| :--- | :--- | :--- |
| **Admin (US)** | `admin@example.com` | USA |
| **Manager (IN)** | `manager.in@example.com` | INDIA |
| **Member (IN)** | `member.in@example.com` | INDIA |
| **Manager (US)** | `manager.us@example.com` | USA |
| **Member (US)** | `member.us@example.com` | USA |

## Testing Scenarios

### 1. Functional Testing: Full Order Flow
1. **Login** as `member.in@example.com`.
2. Navigate to **Restaurants**. You should see "Curry House" and "Spicy Tikka".
3. Select a restaurant and **Add items** to your cart.
4. Go to the **Cart** and click **Place & Pay Order**.
5. Verify the order appears in your **Dashboard**.

### 2. Country Isolation Testing
1. **Login** as `member.us@example.com`.
2. Navigate to **Restaurants**. You should see "Burger King" and "NY Pizza".
3. Verify that "Curry House" (the Indian restaurant) is **not** visible in the list.
4. **Direct URL Test**: Try to navigate to `/restaurants/<india-id>`. The page should display a "Restaurant Not Found" or a GraphQL Forbidden alert.

### 3. Role Restriction Testing (Access Control)
1. **Login** as `member.in@example.com`.
2. Navigate to `/payments`. You should be redirected away or see a "Not Authorized" access guard empty state.
3. **Login** as `admin@example.com`.
4. Navigate to **Payments**. You should now have access to manage payment methods for users.

### 4. Admin Management
1. As the **Admin**, go to the Payments page.
2. Select a user from your country (USA) and try adding a payment method.
3. Verify that the action succeeds.

## Verification Checklist
- [ ] Logged in users see a "Dashboard" link in the Navbar.
- [ ] Cart persists items across page refreshes.
- [ ] Dark Mode toggle in the Navbar updates the UI to the "Warm Slate" theme.
- [ ] Errors (like Role/Country Forbidden) are handled gracefully with UI alerts.
