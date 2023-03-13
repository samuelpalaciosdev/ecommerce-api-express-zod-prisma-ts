"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const errorHandlerMiddleware = (err, req, res, next) => {
    var _a, _b;
    let customError = {
        // set default
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later',
        status: '',
    };
    if (err instanceof zod_1.ZodError) {
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        customError.msg = err.issues.map((issue) => ({ message: issue.message }));
        customError.status = 'failed';
    }
    // ! Duplicate error
    const toUpperCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const duplicateFields = (_b = (_a = err === null || err === void 0 ? void 0 : err.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.join(', ');
        const errorField = toUpperCase(duplicateFields);
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        customError.msg = `${errorField} already exists, please choose another value`;
        // customError.msg = `Duplicate value for field ${duplicateFields}, please choose another value`;
        customError.status = 'failed';
    }
    // ! Cast error (when syntax doesn't match)
    // if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    //   const errorField = (err?.meta?.target as string[])?.join(', ');
    //   customError.statusCode = StatusCodes.NOT_FOUND;
    //   customError.msg = `No item found with id: ${toUpperCase(errorField)}`;
    // }
    // status property based on statusCode
    customError.status = customError.statusCode.toString().startsWith('4') ? 'failed' : 'error';
    return res.status(customError.statusCode).json({ status: customError.status, msg: customError.msg });
};
exports.default = errorHandlerMiddleware;
