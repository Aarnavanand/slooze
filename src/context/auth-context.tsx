// d:\assigment\frontend\src\context\auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "MEMBER";
    country: "INDIA" | "USA";
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Ensure decoded token has role/id/country
                setUser({
                    id: decoded.sub,
                    email: decoded.email,
                    role: decoded.role,
                    country: decoded.country
                });
            } catch (e) {
                logout();
            }
        }
    }, []);

    const login = (token: string, userData: User) => {
        Cookies.set("token", token, { expires: 1 }); // 1 day
        setUser(userData);
        router.push("/dashboard");
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
