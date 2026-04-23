import { NextFunction, Request, Response, Router } from "express";
import postService from "./post.service";
import { Types } from "mongoose";
import { isValid } from "../../middleware";
import { createPostSchema } from "./post.dto";

const router = Router();

router.post(
  "/",
  isValid(createPostSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const createdPost = await postService.create(
      req.body,
      new Types.ObjectId("69e4f13ff1ad6cb0b554be40"),
    );
    return res.status(201).json({
      massege: "post created successfully",
      success: true,
      data: { createdPost },
    });
  },
);

router.post(
  "/reaction",
  async (req: Request, res: Response, next: NextFunction) => {
    await postService.addReaction(
      req.body,
      new Types.ObjectId("69e4f13ff1ad6cb0b554be40"),
    );
    return res.sendStatus(204);
  },
);

export default router;
