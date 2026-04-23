"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReaction = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, required: true, ref: "User" },
    refId: { type: mongoose_1.Types.ObjectId, refPath: "onModel", required: true },
    onModel: { type: String, required: true, enum: common_1.ON_MODEL },
    reaction: {
        type: Number,
        enum: common_1.SYS_REACTION,
        default: common_1.SYS_REACTION.like,
    },
}, { timestamps: true });
exports.UserReaction = (0, mongoose_1.model)("UserReaction", schema);
