"use client";

import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    ShoppingBag,
    ShoppingCart,
    CreditCard,
    Users,
    Store,
    TrendingUp
} from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    const { items, total } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto max-w-7xl p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-foreground">
                        Welcome back, {user.email.split('@')[0]}!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's what's happening with your account today.
                    </p>
                </div>

                {/* User Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.role}</div>
                            <Badge variant={
                                user.role === "ADMIN" ? "destructive" :
                                    user.role === "MANAGER" ? "secondary" : "default"
                            } className="mt-2">
                                {user.role === "ADMIN" ? "Full Access" :
                                    user.role === "MANAGER" ? "Management Access" : "Member Access"}
                            </Badge>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Location</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.country}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Your current region
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{items.length}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Total: ${total.toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/restaurants">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="pt-6 text-center space-y-2">
                                    <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                                    <h3 className="font-semibold">Browse Restaurants</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Explore menus and order food
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/cart">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="pt-6 text-center space-y-2">
                                    <ShoppingCart className="h-8 w-8 mx-auto text-primary" />
                                    <h3 className="font-semibold">View Cart</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {items.length} items in cart
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        {user.role === "ADMIN" && (
                            <Link href="/payments">
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="pt-6 text-center space-y-2">
                                        <CreditCard className="h-8 w-8 mx-auto text-primary" />
                                        <h3 className="font-semibold">Manage Payments</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Admin access only
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        )}

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6 text-center space-y-2">
                                <TrendingUp className="h-8 w-8 mx-auto text-primary" />
                                <h3 className="font-semibold">Your Activity</h3>
                                <p className="text-sm text-muted-foreground">
                                    Coming soon
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Role-Specific Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your account details and permissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-base">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                                <p className="text-base font-mono text-xs">{user.id}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Permissions</p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline">✓</Badge>
                                    <span className="text-sm">Browse restaurants and menus</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline">✓</Badge>
                                    <span className="text-sm">Add items to cart</span>
                                </div>
                                {(user.role === "ADMIN" || user.role === "MANAGER") && (
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">✓</Badge>
                                        <span className="text-sm">Complete checkout and payments</span>
                                    </div>
                                )}
                                {user.role === "ADMIN" && (
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">✓</Badge>
                                        <span className="text-sm">Manage payment methods</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
