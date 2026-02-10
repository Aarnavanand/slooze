import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface RestaurantCardProps {
    id: string;
    name: string;
    country: string;
}

export function RestaurantCard({ id, name, country }: RestaurantCardProps) {
    return (
        <Card className="hover:shadow-md transition-all border-border/50 overflow-hidden group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-muted/50">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        {country}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Explore our delicious menu items and order your favorite meals.
                </p>
            </CardContent>
            <CardFooter className="pt-0">
                <Link href={`/restaurants/${id}`} className="w-full">
                    <Button variant="outline" className="w-full border-border hover:bg-primary hover:text-white transition-all">
                        View Menu
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
