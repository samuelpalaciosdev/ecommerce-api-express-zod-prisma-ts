"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = void 0;
const zod_1 = require("zod");
exports.refreshTokenSchema = zod_1.z.object({
    id: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    ip: zod_1.z.string(),
    isValid: zod_1.z.boolean(),
    userAgent: zod_1.z.string(),
    userId: zod_1.z.string().cuid(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
