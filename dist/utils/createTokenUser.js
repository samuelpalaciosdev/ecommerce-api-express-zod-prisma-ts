"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createTokenUser = (user) => {
    const tokenUser = {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        role: user.role,
    };
    return tokenUser;
};
exports.default = createTokenUser;
