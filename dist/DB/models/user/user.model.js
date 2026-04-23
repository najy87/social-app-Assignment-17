"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const schema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
    },
    email: { type: String, required: true },
    password: {
        type: String,
        required: function () {
            if (this.provider == common_1.SYS_PROVIDER.google) {
                return false;
            }
            return true;
        },
    },
    role: {
        type: Number,
        default: common_1.SYS_ROLE.user,
    },
    provider: {
        type: Number,
        default: common_1.SYS_PROVIDER.system,
    },
    gender: {
        type: Number,
        default: common_1.SYS_GENDER.male,
    },
    phoneNumber: String,
    profilePic: { type: String },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", schema);
