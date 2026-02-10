"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
    fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    if (!allowedRoles.includes(user.role)) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                            <CardTitle>Access Denied</CardTitle>
                        </div>
                        <CardDescription>
                            You don't have permission to access this page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            This page is only accessible to users with the following roles:{" "}
                            <span className="font-semibold">{allowedRoles.join(", ")}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Your current role: <span className="font-semibold">{user.role}</span>
                        </p>
                        <Link href="/restaurants">
                            <Button className="w-full">Go to Restaurants</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
}
