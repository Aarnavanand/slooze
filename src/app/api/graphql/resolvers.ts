import prisma from '@/lib/prisma';
import { signToken, comparePassword, hashPassword } from '@/lib/auth';
import { GraphQLError } from 'graphql';
import { Role, Country, OrderStatus } from '@prisma/client';

const getUser = (context: any) => {
    const user = context.user;
    if (!user) {
        throw new GraphQLError('Unauthorized', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }
    return user;
};

const checkRole = (user: any, roles: Role[]) => {
    if (!roles.includes(user.role)) {
        throw new GraphQLError('Forbidden', {
            extensions: { code: 'FORBIDDEN' },
        });
    }
};

const checkCountry = (user: any, targetCountry: Country) => {
    if (user.country !== targetCountry) {
        throw new GraphQLError('Access restricted by country', {
            extensions: { code: 'FORBIDDEN' },
        });
    }
};

export const resolvers = {
    Query: {
        me: async (_: any, __: any, context: any) => {
            return getUser(context);
        },
        restaurants: async (_: any, __: any, context: any) => {
            const user = getUser(context);
            checkRole(user, [Role.ADMIN, Role.MANAGER, Role.MEMBER]);
            return prisma.restaurant.findMany({
                where: { country: user.country },
            });
        },
        menuItems: async (_: any, { restaurantId }: any, context: any) => {
            const user = getUser(context);
            checkRole(user, [Role.ADMIN, Role.MANAGER, Role.MEMBER]);

            const restaurant = await prisma.restaurant.findUnique({
                where: { id: restaurantId },
            });

            if (!restaurant) throw new GraphQLError('Restaurant not found');
            checkCountry(user, restaurant.country);

            return prisma.menuItem.findMany({
                where: { restaurantId },
            });
        },
    },
    Mutation: {
        login: async (_: any, { input }: any) => {
            const user = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (!user) {
                throw new GraphQLError('Invalid credentials', { extensions: { code: 'UNAUTHENTICATED' } });
            }

            const isValid = await comparePassword(input.password, user.password);
            if (!isValid) {
                throw new GraphQLError('Invalid credentials', { extensions: { code: 'UNAUTHENTICATED' } });
            }

            return {
                accessToken: signToken(user),
                user,
            };
        },
        createOrder: async (_: any, { input }: any, context: any) => {
            const user = getUser(context);
            checkRole(user, [Role.ADMIN, Role.MANAGER, Role.MEMBER]);

            const restaurant = await prisma.restaurant.findUnique({
                where: { id: input.restaurantId },
            });

            if (!restaurant) throw new GraphQLError('Restaurant not found');
            checkCountry(user, restaurant.country);

            let totalAmount = 0;
            const orderItemsData = [];

            for (const itemInput of input.items) {
                const menuItem = await prisma.menuItem.findUnique({
                    where: { id: itemInput.menuItemId },
                });

                if (!menuItem) throw new GraphQLError(`Menu item ${itemInput.menuItemId} not found`);
                if (menuItem.restaurantId !== input.restaurantId) {
                    throw new GraphQLError(`Menu item ${menuItem.name} does not belong to this restaurant`);
                }

                totalAmount += menuItem.price * itemInput.quantity;
                orderItemsData.push({
                    menuItemId: itemInput.menuItemId,
                    quantity: itemInput.quantity,
                });
            }

            return prisma.order.create({
                data: {
                    userId: user.id,
                    restaurantId: input.restaurantId,
                    status: OrderStatus.CREATED,
                    totalAmount,
                    items: {
                        create: orderItemsData,
                    },
                },
                include: {
                    items: { include: { menuItem: true } },
                    restaurant: true,
                    user: true,
                },
            });
        },
        cancelOrder: async (_: any, { id }: any, context: any) => {
            const user = getUser(context);
            checkRole(user, [Role.ADMIN, Role.MANAGER, Role.MEMBER]);

            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) throw new GraphQLError('Order not found');

            if (user.role === Role.MEMBER) {
                if (order.userId !== user.id) {
                    throw new GraphQLError('You can only cancel your own orders');
                }
            } else {
                const orderUser = await prisma.user.findUnique({ where: { id: order.userId } });
                if (orderUser!.country !== user.country) {
                    throw new GraphQLError('Cannot manage orders from another country');
                }
            }

            if (order.status !== OrderStatus.CREATED) {
                throw new GraphQLError('Cannot cancel processed orders');
            }

            return prisma.order.update({
                where: { id },
                data: { status: OrderStatus.CANCELLED },
                include: { items: { include: { menuItem: true } }, restaurant: true, user: true },
            });
        },
        checkoutOrder: async (_: any, { id }: any, context: any) => {
            const user = getUser(context);
            checkRole(user, [Role.MEMBER]);

            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) throw new GraphQLError('Order not found');
            if (order.userId !== user.id) throw new GraphQLError('You can only checkout your own orders');
            if (order.status !== OrderStatus.CREATED) throw new GraphQLError('Order already processed or cancelled');

            return prisma.order.update({
                where: { id },
                data: { status: OrderStatus.PAID },
                include: { items: { include: { menuItem: true } }, restaurant: true, user: true },
            });
        },
        createPaymentMethod: async (_: any, { input }: any, context: any) => {
            const user = getUser(context);
            checkRole(user, [Role.ADMIN]);

            const targetUser = await prisma.user.findUnique({
                where: { id: input.userId },
            });

            if (!targetUser) throw new GraphQLError('User not found');
            checkCountry(user, targetUser.country);

            return prisma.paymentMethod.create({
                data: {
                    userId: input.userId,
                    type: input.type,
                    last4Digits: input.last4Digits,
                },
                include: { user: true },
            });
        },
        updatePaymentMethod: async (_: any, { id, input }: any, context: any) => {
            const user = getUser(context);
            checkRole(user, [Role.ADMIN]);

            const pm = await prisma.paymentMethod.findUnique({
                where: { id },
                include: { user: true },
            });
            if (!pm) throw new GraphQLError('Payment method not found');
            checkCountry(user, pm.user.country);

            return prisma.paymentMethod.update({
                where: { id },
                data: {
                    type: input.type ?? undefined,
                    last4Digits: input.last4Digits ?? undefined,
                },
                include: { user: true },
            });
        },
    },
    Restaurant: {
        menuItems: async (parent: any) => {
            return prisma.menuItem.findMany({
                where: { restaurantId: parent.id },
            });
        },
    },
    MenuItem: {
        restaurant: async (parent: any) => {
            return prisma.restaurant.findUnique({ where: { id: parent.restaurantId } });
        }
    },
    Order: {
        user: async (parent: any) => {
            return prisma.user.findUnique({ where: { id: parent.userId } });
        },
        restaurant: async (parent: any) => {
            return prisma.restaurant.findUnique({ where: { id: parent.restaurantId } });
        },
        items: async (parent: any) => {
            return prisma.orderItem.findMany({ where: { orderId: parent.id }, include: { menuItem: true } });
        }
    },
    OrderItem: {
        menuItem: async (parent: any) => {
            if (parent.menuItem) return parent.menuItem;
            return prisma.menuItem.findUnique({ where: { id: parent.menuItemId } });
        }
    },
    PaymentMethod: {
        user: async (parent: any) => {
            return prisma.user.findUnique({ where: { id: parent.userId } });
        }
    }
};
