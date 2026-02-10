"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface MenuItemCardProps {
    id: string;
    name: string;
    price: number;
    onAddToCart: (quantity: number) => void;
}

export function MenuItemCard({ id, name, price, onAddToCart }: MenuItemCardProps) {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        onAddToCart(quantity);
        setQuantity(1);
    };

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 text-foreground">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold">{name}</CardTitle>
                    <span className="text-lg font-bold text-highlight">
                        ${price.toFixed(2)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Select Quantity:</span>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="h-8 w-8 rounded-lg border-border"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center font-medium text-foreground">{quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(quantity + 1)}
                            className="h-8 w-8 rounded-lg border-border"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleAddToCart} className="w-full shadow-sm">
                    Add {quantity} to Cart — ${(price * quantity).toFixed(2)}
                </Button>
            </CardFooter>
        </Card>
    );
}
