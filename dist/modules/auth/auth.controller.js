"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const middleware_1 = require("../../middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// signup
router.post("/signup", (0, middleware_1.isValid)(auth_validation_1.signupSchema), async (req, res, next) => {
    // call service
    await auth_service_1.default.signup(req.body);
    // send response
    return res.status(201).json({
        massege: "user created successfully",
        success: true,
    });
});
router.post("/login", async (req, res, next) => {
    await auth_service_1.default.login(req.body);
    return res.status(200).json({
        massege: "login successfully",
        success: true,
    });
});
router.post("/verify-account", async (req, res, next) => {
    await auth_service_1.default.verifyAccount(req.body);
    return res.status(200).json({
        massege: "user verifed successfully",
        success: true,
    });
});
router.post("/resend-otp", async (req, res, next) => {
    await auth_service_1.default.sendOtp(req.body);
    return res.status(200).json({
        massege: "resend otp successfully",
        success: true,
    });
});
router.patch("/reset-password", async (req, res, next) => {
    await auth_service_1.default.resetPassword(req.body);
    return res.status(200).json({
        massege: "reset password successfully",
        success: true,
    });
});
exports.default = router;
