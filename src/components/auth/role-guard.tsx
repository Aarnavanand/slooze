// d:\assigment\frontend\src\components\auth\role-guard.tsx
"use client";

import { useAuth } from "@/context/auth-context";
import { ReactNode } from "react";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: ("ADMIN" | "MANAGER" | "MEMBER")[];
    fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { user } = useAuth();

    if (!user) return null;

    if (allowedRoles.includes(user.role)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
