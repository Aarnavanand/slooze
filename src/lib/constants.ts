export const SEEDED_USERS = [
    { email: 'admin@example.com', password: 'password123', role: 'ADMIN', country: 'USA', name: 'Admin User' },
    { email: 'manager.in@example.com', password: 'password123', role: 'MANAGER', country: 'INDIA', name: 'Manager India' },
    { email: 'manager.us@example.com', password: 'password123', role: 'MANAGER', country: 'USA', name: 'Manager USA' },
    { email: 'member.in@example.com', password: 'password123', role: 'MEMBER', country: 'INDIA', name: 'Member India' },
    { email: 'member.us@example.com', password: 'password123', role: 'MEMBER', country: 'USA', name: 'Member USA' },
] as const;

export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER',
}

export enum Country {
    INDIA = 'INDIA',
    USA = 'USA',
}
