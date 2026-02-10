"use client";

import { Navbar } from "@/components/navbar";
import { RoleGuard } from "@/components/role-guard";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertCircle } from "lucide-react";

const CREATE_PAYMENT = gql`
  mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
    createPaymentMethod(input: $input) {
      id
      type
      last4Digits
      user {
        email
      }
    }
  }
`;

export default function PaymentsPage() {
    const [userId, setUserId] = useState("");
    const [type, setType] = useState("Credit Card");
    const [last4, setLast4] = useState("");

    const [createPayment, { loading, error }] = useMutation(CREATE_PAYMENT);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPayment({
                variables: {
                    input: { userId, type, last4Digits: last4 },
                },
            });
            setUserId("");
            setLast4("");
        } catch (e) {
            // Error handled by mutation
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto max-w-2xl p-6">
                <RoleGuard allowedRoles={["ADMIN"]}>
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Manage Payment Methods</h1>
                        <p className="text-muted-foreground">
                            Add payment methods for users (Same Country Only)
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <CreditCard className="h-6 w-6 text-primary" />
                                <CardTitle>Add Payment Method</CardTitle>
                            </div>
                            <CardDescription>
                                Create a new payment method for a user in your country
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">User ID</label>
                                    <Input
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        placeholder="Enter user UUID"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        The UUID of the user to add the payment method for
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Payment Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option>Credit Card</option>
                                        <option>Debit Card</option>
                                        <option>PayPal</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last 4 Digits</label>
                                    <Input
                                        value={last4}
                                        onChange={(e) => setLast4(e.target.value)}
                                        maxLength={4}
                                        placeholder="1234"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Last 4 digits of the card number
                                    </p>
                                </div>

                                {error && (
                                    <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                        <AlertCircle className="h-4 w-4" />
                                        <p className="text-sm">{error.message}</p>
                                    </div>
                                )}

                                <Button type="submit" disabled={loading} className="w-full" size="lg">
                                    {loading ? "Adding..." : "Add Payment Method"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-6 border-primary/20 bg-primary/5">
                        <CardContent className="pt-6">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Country Restriction</p>
                                    <p className="text-sm text-muted-foreground">
                                        You can only add payment methods for users in your country.
                                        This is enforced by the backend authorization rules.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </RoleGuard>
            </main>
        </div>
    );
}
