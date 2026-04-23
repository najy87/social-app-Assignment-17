"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
exports.compare = compare;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 *
 * @param password from body
 * @returns hashed password
 */
async function hash(password) {
    return bcrypt_1.default.hash(password, 10);
}
/**
 *
 * @param password from body
 * @param hashedPassword from DB
 * @returns promise of boolen
 */
async function compare(password, hashedPassword) {
    // from body , from DB
    return bcrypt_1.default.compare(password, hashedPassword);
}
