// main function run;
import express, { NextFunction, Request, Response } from "express";
import { connectDB } from "./DB/connection";
import { authRouter, commentRouter, postRouter } from "./modules";
import { BadRequestException } from "./common";
import { redisConnect } from "./common/utils/redis.utils";
export function bootstrap() {
  const app = express();
  const port = 3000;
  connectDB();
  redisConnect();
  // routing
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);

  // global error handler

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status((error.cause as number) || 500).json({
      massege: error.message,
      success: false,
      stack: error.stack,
      details: error instanceof BadRequestException ? error.details : undefined, // ternaly operator
    });
  });

  app.listen(port, () => {
    console.log(`app is running in port ${port}`);
  });
}
