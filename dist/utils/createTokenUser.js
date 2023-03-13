"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createTokenUser = (user) => {
    var _a;
    const tokenUser = {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        role: user.role,
        refreshToken: (_a = user.refreshToken) !== null && _a !== void 0 ? _a : null,
    };
    return tokenUser;
};
exports.default = createTokenUser;
