"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEEDED_USERS } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        name
        email
        role
        country
      }
    }
  }
`;

export default function LoginPage() {
    const [selectedUser, setSelectedUser] = useState<typeof SEEDED_USERS[number] | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data: any) => {
            login(data?.login?.accessToken, data.login.user);
        },
        onError: (err) => {
            setError(err.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            setError("Please select a user");
            return;
        }
        loginMutation({
            variables: {
                input: {
                    email: selectedUser.email,
                    password: password || selectedUser.password,
                },
            },
        });
    };

    const handleUserSelect = (user: typeof SEEDED_USERS[number]) => {
        setSelectedUser(user);
        setPassword(user.password);
        setShowDropdown(false);
        setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border/50 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-foreground">
                        Welcome to Slooze
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Select a user to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                            {error}
                        </div>
                    )}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* User Selection Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select User</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-lg bg-background hover:bg-accent transition-colors"
                                >
                                    {selectedUser ? (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm">{selectedUser.name}</span>
                                            <Badge variant={
                                                selectedUser.role === "ADMIN" ? "destructive" :
                                                    selectedUser.role === "MANAGER" ? "secondary" : "default"
                                            } className="text-xs">
                                                {selectedUser.role}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {selectedUser.country}
                                            </Badge>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Choose a user...</span>
                                    )}
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-border rounded-lg shadow-xl max-h-60 overflow-auto">
                                        {SEEDED_USERS.map((user) => (
                                            <button
                                                key={user.email}
                                                type="button"
                                                onClick={() => handleUserSelect(user)}
                                                className="w-full px-3 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between border-b border-border last:border-0"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Badge variant={
                                                        user.role === "ADMIN" ? "destructive" :
                                                            user.role === "MANAGER" ? "secondary" : "default"
                                                    } className="text-xs">
                                                        {user.role}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {user.country}
                                                    </Badge>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Default password: <code className="bg-muted px-1 py-0.5 rounded">password123</code>
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !selectedUser}
                            className="w-full"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    {/* Quick Login Hint */}
                    <div className="mt-6 pt-6 border-t">
                        <p className="text-xs text-center text-muted-foreground">
                            💡 Select any user above to test different roles and permissions
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
