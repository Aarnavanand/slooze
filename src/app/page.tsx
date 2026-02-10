"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { ShoppingBag, Shield, Globe } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Welcome to Slooze
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Order food from your favorite restaurants with our secure, role-based platform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/restaurants">
              <Button size="lg" className="w-full sm:w-auto shadow-md">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Restaurants
              </Button>
            </Link>
            {!user && (
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Easy Ordering</h3>
                <p className="text-sm text-muted-foreground">
                  Browse menus and place orders with just a few clicks
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">
                  Secure permissions for Admin, Manager, and Member roles
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Globe className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold text-foreground">Multi-Country</h3>
                <p className="text-sm text-muted-foreground">
                  Support for multiple countries with localized content
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
