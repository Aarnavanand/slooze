"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const { user, logout } = useAuth();
    const { items } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">
                            Slooze
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost">Dashboard</Button>
                                </Link>
                                <Link href="/restaurants">
                                    <Button variant="ghost">Restaurants</Button>
                                </Link>
                                <Link href="/cart">
                                    <Button variant="ghost" size="icon" className="relative">
                                        <ShoppingCart className="h-5 w-5" />
                                        {itemCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm ring-1 ring-background">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                {user.role === "ADMIN" && (
                                    <Link href="/payments">
                                        <Button variant="ghost">Payments</Button>
                                    </Link>
                                )}

                                {/* User Info */}
                                <div className="flex items-center space-x-2">
                                    <Badge variant={
                                        user.role === "ADMIN" ? "destructive" :
                                            user.role === "MANAGER" ? "secondary" : "default"
                                    }>
                                        {user.role}
                                    </Badge>
                                    <Badge variant="outline">
                                        {user.country}
                                    </Badge>
                                </div>

                                <ThemeToggle />

                                <Button variant="ghost" size="icon" onClick={logout}>
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/restaurants">
                                    <Button variant="ghost">Restaurants</Button>
                                </Link>
                                <ThemeToggle />
                                <Link href="/login">
                                    <Button>Login</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center space-x-2 md:hidden">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t">
                    <div className="container mx-auto px-4 py-4 space-y-3">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-2 pb-3 border-b">
                                    <Badge variant={
                                        user.role === "ADMIN" ? "destructive" :
                                            user.role === "MANAGER" ? "secondary" : "default"
                                    }>
                                        {user.role}
                                    </Badge>
                                    <Badge variant="outline">
                                        {user.country}
                                    </Badge>
                                </div>
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/restaurants" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">
                                        Restaurants
                                    </Button>
                                </Link>
                                <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start relative">
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Cart
                                        {itemCount > 0 && (
                                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm ring-1 ring-background">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                {user.role === "ADMIN" && (
                                    <Link href="/payments" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            Payments
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/restaurants" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">
                                        Restaurants
                                    </Button>
                                </Link>
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full">Login</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
