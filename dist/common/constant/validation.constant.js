"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFildes = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../enums");
exports.generalFildes = {
    email: zod_1.default.email({ message: "invalid email adress" }),
    gender: zod_1.default.enum(enums_1.SYS_GENDER).optional(),
    password: zod_1.default
        .string({ message: "password is required" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    userName: zod_1.default.string({ message: "username is required" }).min(2).max(20),
    phoneNumber: zod_1.default
        .string({ message: "invalid phone number" })
        .regex(/^(00201|01|\+201)[0-25]{1}[0-9]{8}$/),
};
