"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
// main function run;
const express_1 = __importDefault(require("express"));
const connection_1 = require("./DB/connection");
const modules_1 = require("./modules");
const common_1 = require("./common");
const redis_utils_1 = require("./common/utils/redis.utils");
function bootstrap() {
    const app = (0, express_1.default)();
    const port = 3000;
    (0, connection_1.connectDB)();
    (0, redis_utils_1.redisConnect)();
    // routing
    app.use(express_1.default.json());
    app.use("/auth", modules_1.authRouter);
    app.use("/post", modules_1.postRouter);
    app.use("/comment", modules_1.commentRouter);
    // global error handler
    app.use((error, req, res, next) => {
        return res.status(error.cause || 500).json({
            massege: error.message,
            success: false,
            stack: error.stack,
            details: error instanceof common_1.BadRequestException ? error.details : undefined, // ternaly operator
        });
    });
    app.listen(port, () => {
        console.log(`app is running in port ${port}`);
    });
}
