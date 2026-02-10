"use client";

import { useQuery } from "@apollo/client/react";
import { GET_MENU_ITEMS } from "@/lib/graphql/queries";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { useCart } from "@/context/cart-context";
import { MenuItemCard } from "@/components/menu-item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RestaurantMenuPage() {
    const { id } = useParams();
    const { data, loading, error } = useQuery<any>(GET_MENU_ITEMS, {
        variables: { restaurantId: id },
    });
    const { addItem } = useCart();

    const handleAddToCart = (item: any, quantity: number) => {
        addItem(
            {
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                quantity,
            },
            id as string
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto max-w-7xl p-6">
                <div className="mb-8">
                    <Link href="/restaurants">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Restaurants
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Menu</h1>
                    <p className="text-muted-foreground">
                        Select items to add to your cart
                    </p>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/4 mt-2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full mt-4" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {error && (
                    <Card className="border-destructive">
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2 text-destructive">
                                <AlertCircle className="h-5 w-5" />
                                <p>Error loading menu: {error.message}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {data && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.menuItems.map((item: any) => (
                                <MenuItemCard
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    price={item.price}
                                    onAddToCart={(quantity) => handleAddToCart(item, quantity)}
                                />
                            ))}
                        </div>

                        {data.menuItems.length === 0 && (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <p className="text-muted-foreground">
                                        No menu items available.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
