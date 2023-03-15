"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5000', 'https://auth-w-react-zod-ts.vercel.app'],
    credentials: true,
};
exports.default = corsOptions;
