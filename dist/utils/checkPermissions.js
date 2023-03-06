"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin')
        return;
    if (requestUser.id === resourceUserId)
        return;
    throw new errors_1.UnauthorizedError('You are not authorized to access this route');
};
exports.default = checkPermissions;
