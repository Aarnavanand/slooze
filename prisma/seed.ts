// d:\assigment\backend\prisma\seed.ts

import { PrismaClient, Role, Country, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Clean up
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash('password123', 10);

    // --- Users ---
    const usersData = [
        { name: 'Admin User', email: 'admin@example.com', role: Role.ADMIN, country: Country.USA },
        { name: 'Manager India', email: 'manager.in@example.com', role: Role.MANAGER, country: Country.INDIA },
        { name: 'Manager USA', email: 'manager.us@example.com', role: Role.MANAGER, country: Country.USA },
        { name: 'Member India', email: 'member.in@example.com', role: Role.MEMBER, country: Country.INDIA },
        { name: 'Member USA', email: 'member.us@example.com', role: Role.MEMBER, country: Country.USA },
    ];

    for (const u of usersData) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                name: u.name,
                email: u.email,
                password,
                role: u.role,
                country: u.country,
            },
        });
    }

    // --- Restaurants ---
    const restaurantsData = [
        { name: 'Curry House', country: Country.INDIA },
        { name: 'Burger King', country: Country.USA },
        { name: 'Spicy Tikka', country: Country.INDIA },
        { name: 'NY Pizza', country: Country.USA },
    ];

    for (const r of restaurantsData) {
        const restaurant = await prisma.restaurant.create({
            data: {
                name: r.name,
                country: r.country,
                menuItems: {
                    create: [
                        { name: 'Signature Dish 1', price: 10.99 },
                        { name: 'Signature Dish 2', price: 15.50 },
                        { name: 'Drink', price: 2.99 },
                    ],
                },
            },
        });
        console.log(`Created restaurant: ${restaurant.name}`);
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
