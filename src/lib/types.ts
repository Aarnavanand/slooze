export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER',
}

export enum Country {
    INDIA = 'INDIA',
    USA = 'USA',
}

export enum OrderStatus {
    CREATED = 'CREATED',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: Role;
    country: Country;
    createdAt: Date;
    updatedAt: Date;
}
