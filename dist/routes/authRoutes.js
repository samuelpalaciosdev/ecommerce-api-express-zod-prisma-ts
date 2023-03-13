"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const router = express_1.default.Router();
const authentication_1 = __importDefault(require("../middleware/authentication"));
const rateLimiter_1 = __importDefault(require("../middleware/rateLimiter"));
router.post('/register', rateLimiter_1.default, authControllers_1.register);
router.post('/login', rateLimiter_1.default, authControllers_1.login);
router.post('/refresh', authentication_1.default, authControllers_1.generateNewRefreshToken);
router.delete('/logout', authentication_1.default, authControllers_1.logout);
exports.default = router;
