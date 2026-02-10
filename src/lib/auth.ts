import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, Role, Country } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const signToken = (user: any) => {
    return jwt.sign(
        { sub: user.id, email: user.email, role: user.role, country: user.country },
        JWT_SECRET,
        { expiresIn: '1d' }
    );
};

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role as Role,
            country: decoded.country as Country
        };
    } catch (e) {
        return null;
    }
};
