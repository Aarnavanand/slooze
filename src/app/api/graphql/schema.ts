import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  enum Role {
    ADMIN
    MANAGER
    MEMBER
  }

  enum Country {
    INDIA
    USA
  }

  enum OrderStatus {
    CREATED
    PAID
    CANCELLED
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    country: Country!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Restaurant {
    id: ID!
    name: String!
    country: Country!
    menuItems: [MenuItem!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type MenuItem {
    id: ID!
    name: String!
    price: Float!
    restaurantId: String!
    restaurant: Restaurant!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Order {
    id: ID!
    userId: String!
    user: User!
    restaurantId: String!
    restaurant: Restaurant!
    status: OrderStatus!
    totalAmount: Float!
    items: [OrderItem!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderItem {
    id: ID!
    menuItemId: String!
    menuItem: MenuItem!
    quantity: Int!
  }

  type PaymentMethod {
    id: ID!
    userId: String!
    user: User!
    type: String!
    last4Digits: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type LoginResponse {
    accessToken: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateOrderInput {
    restaurantId: String!
    items: [OrderItemInput!]!
  }

  input OrderItemInput {
    menuItemId: String!
    quantity: Int!
  }

  input CreatePaymentMethodInput {
    userId: String!
    type: String!
    last4Digits: String!
  }

  input UpdatePaymentMethodInput {
    type: String
    last4Digits: String
  }

  type Query {
    restaurants: [Restaurant!]!
    menuItems(restaurantId: ID!): [MenuItem!]!
    # Additional queries if needed
    me: User
  }

  type Mutation {
    login(input: LoginInput!): LoginResponse!
    createOrder(input: CreateOrderInput!): Order!
    cancelOrder(id: ID!): Order!
    checkoutOrder(id: ID!): Order!
    createPaymentMethod(input: CreatePaymentMethodInput!): PaymentMethod!
    updatePaymentMethod(id: ID!, input: UpdatePaymentMethodInput!): PaymentMethod!
  }
`;
