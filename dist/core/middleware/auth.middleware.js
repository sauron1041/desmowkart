"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("@core/utils");
class AuthMiddleware {
}
AuthMiddleware.authorization = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return (0, utils_1.sendResponse)(res, 401, 'token is required');
        // req.id = 1;
        // req.role = 1;
        // return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("decoded", decoded);
        if (decoded && typeof decoded === 'object' && 'id' in decoded) {
            req.id = decoded.id;
            next();
        }
        else {
            return (0, utils_1.sendResponse)(res, 401, 'invalid token');
            // req.id = 1;
            // req.role = 1;
            // return next();
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return (0, utils_1.sendResponse)(res, 401, error.message);
        }
        else {
            return (0, utils_1.sendResponse)(res, 401, 'token verification failed');
        }
    }
    // req.id = 1;
    // req.role = 1;
    // next();
};
AuthMiddleware.authorize = (roles) => {
    return (req, res, next) => {
        if (req.id) {
            if (roles === req.role) {
                return next();
            }
            return (0, utils_1.sendResponse)(res, 403, 'permission denied');
        }
        return (0, utils_1.sendResponse)(res, 401, 'token is required');
    };
};
exports.default = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map