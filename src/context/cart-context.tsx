// d:\assigment\frontend\src\context\cart-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CartItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    restaurantId: string | null;
    addItem: (item: CartItem, restaurantId: string) => void;
    removeItem: (menuItemId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType>({
    items: [],
    restaurantId: null,
    addItem: () => { },
    removeItem: () => { },
    clearCart: () => { },
    total: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            const parsed = JSON.parse(saved);
            setItems(parsed.items || []);
            setRestaurantId(parsed.restaurantId || null);
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify({ items, restaurantId }));
    }, [items, restaurantId]);

    const addItem = (newItem: CartItem, newRestaurantId: string) => {
        if (restaurantId && restaurantId !== newRestaurantId) {
            if (!confirm("Start a new cart? This will clear your current items.")) return;
            setItems([]);
        }

        setRestaurantId(newRestaurantId);
        setItems((prev) => {
            const existing = prev.find((i) => i.menuItemId === newItem.menuItemId);
            if (existing) {
                return prev.map((i) =>
                    i.menuItemId === newItem.menuItemId
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }
            return [...prev, newItem];
        });
    };

    const removeItem = (menuItemId: string) => {
        setItems((prev) => {
            const newItems = prev.filter((i) => i.menuItemId !== menuItemId);
            if (newItems.length === 0) setRestaurantId(null);
            return newItems;
        });
    };

    const clearCart = () => {
        setItems([]);
        setRestaurantId(null);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, restaurantId, addItem, removeItem, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
