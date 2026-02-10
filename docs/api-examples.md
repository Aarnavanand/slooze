# API Examples

The Slooze API is exposed via a single GraphQL endpoint: `/api/graphql`.
All requests (except `login`) require an `Authorization` header.

## Authorization Header
```http
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication

### Login Mutation
Used to obtain a JWT for a seeded user.

**Mutation:**
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    user {
      id
      email
      role
      country
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "admin@example.com",
    "password": "password123"
  }
}
```

---

## 🍽️ Restaurants & Menus

### Get Restaurants (Country Filtered)
Returns restaurants in the user's current country.

**Query:**
```graphql
query GetRestaurants {
  restaurants {
    id
    name
    country
  }
}
```

### Get Menu Items
**Query:**
```graphql
query GetMenuItems($restaurantId: ID!) {
  menuItems(restaurantId: $restaurantId) {
    id
    name
    price
  }
}
```

---

## 🛒 Orders

### Create Order
**Mutation:**
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    status
    totalAmount
    items {
      name
      quantity
      price
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "restaurantId": "restaurant-uuid",
    "items": [
      { "menuItemId": "item-uuid", "quantity": 2 }
    ]
  }
}
```

### Checkout Order
*Note: Limited to MEMBER role.*

**Mutation:**
```graphql
mutation CheckoutOrder($id: ID!) {
  checkoutOrder(id: $id) {
    id
    status
  }
}
```

---

## 💳 Payment Management

### Create Payment Method
*Note: Limited to ADMIN role.*

**Mutation:**
```graphql
mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
  createPaymentMethod(input: $input) {
    id
    type
    last4Digits
    user {
      email
    }
  }
}
```

---

## ⚠️ Error Responses

### Unauthorized (Missing Token)
```json
{
  "errors": [{
    "message": "Unauthorized",
    "extensions": { "code": "UNAUTHENTICATED" }
  }]
}
```

### Forbidden (Role or Country Mismatch)
```json
{
  "errors": [{
    "message": "Access restricted by country",
    "extensions": { "code": "FORBIDDEN" }
  }]
}
```
