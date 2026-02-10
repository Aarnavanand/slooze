"use client";

import { useCart } from "@/context/cart-context";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      totalAmount
    }
  }
`;

const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($id: ID!) {
    checkoutOrder(id: $id) {
      id
      status
    }
  }
`;

export default function CartPage() {
    const { items, restaurantId, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER);
    const [checkoutOrder, { loading: checkingOut }] = useMutation(CHECKOUT_ORDER);

    const canCheckout = user && (user.role === "ADMIN" || user.role === "MANAGER");

    const handlePlaceOrder = async () => {
        if (!restaurantId) return;

        try {
            const res = await createOrder({
                variables: {
                    input: {
                        restaurantId,
                        items: items.map((i) => ({
                            menuItemId: i.menuItemId,
                            quantity: i.quantity,
                        })),
                    },
                },
            });

            const orderId = (res.data as any).createOrder.id;

            await checkoutOrder({
                variables: { id: orderId },
            });

            clearCart();
            router.push("/restaurants");
        } catch (e: any) {
            alert("Error placing order: " + e.message);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto max-w-4xl p-6">
                <div className="mb-8">
                    <Link href="/restaurants">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Restaurants
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Your Cart</h1>
                    <p className="text-muted-foreground">Review your order before checkout</p>
                </div>

                {items.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center space-y-4">
                            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-lg font-medium">Your cart is empty</p>
                                <p className="text-sm text-muted-foreground">
                                    Add some delicious items to get started
                                </p>
                            </div>
                            <Link href="/restaurants">
                                <Button>Browse Restaurants</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item.menuItemId} className="border-border/50 shadow-sm">
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 text-foreground">
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    ${item.price.toFixed(2)} each
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="secondary" className="bg-muted/50">x{item.quantity}</Badge>
                                                <p className="font-bold mt-2 text-highlight">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-20 border-border/50 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-foreground">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {items.map((item) => (
                                            <div
                                                key={item.menuItemId}
                                                className="flex justify-between text-sm"
                                            >
                                                <span className="text-muted-foreground">
                                                    {item.name} x{item.quantity}
                                                </span>
                                                <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-border">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-foreground">Total</span>
                                            <span className="text-highlight">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col space-y-2">
                                    {canCheckout ? (
                                        <Button
                                            onClick={handlePlaceOrder}
                                            disabled={creating || checkingOut}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {creating
                                                ? "Creating Order..."
                                                : checkingOut
                                                    ? "Processing Payment..."
                                                    : "Place & Pay Order"}
                                        </Button>
                                    ) : (
                                        <div className="w-full space-y-2">
                                            <Button disabled className="w-full" size="lg">
                                                Checkout (Admin/Manager Only)
                                            </Button>
                                            <p className="text-xs text-center text-muted-foreground">
                                                Only Admins and Managers can complete checkout
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={clearCart}
                                        className="w-full"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
