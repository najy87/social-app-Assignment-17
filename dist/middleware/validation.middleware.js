"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const common_1 = require("../common");
const isValid = (schema) => {
    return async (req, res, next) => {
        const reslut = await schema.safeParseAsync(req.body);
        if (reslut.success == false) {
            // prepare errors
            const errMasseges = reslut.error.issues.map((issue) => ({
                path: issue.path[0],
                messege: issue.message,
            }));
            throw new common_1.BadRequestException("validation error", errMasseges);
        }
        next();
    };
};
exports.isValid = isValid;
