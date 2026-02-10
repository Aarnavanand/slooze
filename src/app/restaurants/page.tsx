"use client";

import { useQuery } from "@apollo/client/react";
import { GET_RESTAURANTS } from "@/lib/graphql/queries";
import { Navbar } from "@/components/navbar";
import { RestaurantCard } from "@/components/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function RestaurantsPage() {
    const { loading, error, data } = useQuery<any>(GET_RESTAURANTS);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto max-w-7xl p-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Restaurants</h1>
                    <p className="text-muted-foreground">
                        Browse restaurants and explore their menus
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
                                    <Skeleton className="h-4 w-full" />
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
                                <p>Error loading restaurants: {error.message}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {data && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.restaurants.map((restaurant: any) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    id={restaurant.id}
                                    name={restaurant.name}
                                    country={restaurant.country}
                                />
                            ))}
                        </div>

                        {data.restaurants.length === 0 && (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <p className="text-muted-foreground">
                                        No restaurants found in your region.
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
