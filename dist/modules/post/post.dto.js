"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.createPostSchema = zod_1.default
    .object({
    content: zod_1.default.string().optional(),
    attatchment: zod_1.default.array(zod_1.default.string()).optional(),
})
    .refine((data) => {
    const { attatchment, content } = data;
    if (!content && (!attatchment || attatchment?.length == 0)) {
        throw new common_1.BadRequestException("content or attatchments must be provided");
    }
    return true;
});
