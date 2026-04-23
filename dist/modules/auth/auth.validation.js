"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
// zod
const zod_1 = __importDefault(require("zod"));
const constant_1 = require("../../common/constant");
exports.signupSchema = zod_1.default.object({
    email: constant_1.generalFildes.email,
    gender: constant_1.generalFildes.gender,
    password: constant_1.generalFildes.password,
    phoneNumber: constant_1.generalFildes.phoneNumber,
    userName: constant_1.generalFildes.userName,
});
// export const loginSchema =
// export const forgetPasswordSchema =
