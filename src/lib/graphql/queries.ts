// d:\assigment\frontend\src\lib\graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      country
    }
  }
`;

export const GET_MENU_ITEMS = gql`
  query GetMenuItems($restaurantId: ID!) {
    menuItems(restaurantId: $restaurantId) {
      id
      name
      price
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      totalAmount
    }
  }
`;

export const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($id: ID!) {
    checkoutOrder(id: $id) {
       id
       status
    }
  }
`;
