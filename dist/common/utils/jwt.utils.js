"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.generateTokens = generateTokens;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = __importDefault(require("node:crypto"));
function signToken(payload, secret, options) {
    payload.jti = node_crypto_1.default.randomBytes(10).toString("hex");
    return jsonwebtoken_1.default.sign(payload, secret, options);
}
function verifyToken(token, secret) {
    return jsonwebtoken_1.default.verify(token, secret);
}
function generateTokens(payload) {
    const accessToken = signToken(payload, "fkdjfdjvkvsdkjvnv", {
        expiresIn: 60 * 200,
    });
    const refreshToken = signToken(payload, "fjdsgiuegegiesg", {
        expiresIn: "1y",
    });
    return { accessToken, refreshToken };
}
