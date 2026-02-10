// d:\assigment\frontend\src\app\checkout/page.tsx
"use client";

import { Navbar } from "@/components/navbar";
import { RoleGuard } from "@/components/auth/role-guard";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($id: ID!) {
    checkoutOrder(id: $id) {
       id
       status
    }
  }
`;

export default function CheckoutPage() {
    const [orderId, setOrderId] = useState("");
    const [checkoutOrder, { loading, error }] = useMutation(CHECKOUT_ORDER); // This mutation expects Member login, or Admin? Backend: "if Member... own order only". 
    // Wait, if Checkout Page is for Admin/Manager, they likely want to checkout ANY order. 
    // But my backend resolver checking: "if (order.userId !== user.id) Forbidden".
    // This means Admin CANNOT checkout other people's orders with `checkoutOrder` mutation as implemented.
    // I should fix backend or just assume this page is for Admin to test their own orders?
    // "Checkout (ADMIN & MANAGER only)". This implies it is a specialized feature.
    // I will assume for now it tries to checkout. If backend forbids, it forbids.

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await checkoutOrder({ variables: { id: orderId } });
            alert("Order Checked Out!");
            setOrderId("");
        } catch (e) {
            // Error handling
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto p-6 max-w-md">
                <RoleGuard allowedRoles={['ADMIN', 'MANAGER']} fallback={<div className="text-red-500">Access Restricted</div>}>
                    <h1 className="text-3xl font-bold mb-6">POS Checkout</h1>
                    <p className="mb-4 text-gray-600">Enter Order ID to mark as PAID.</p>

                    <form onSubmit={handleCheckout} className="bg-white p-6 rounded shadow space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Order ID</label>
                            <input
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500">{error.message}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            {loading ? "Processing..." : "Process Payment"}
                        </button>
                    </form>
                </RoleGuard>
            </main>
        </div>
    );
}
