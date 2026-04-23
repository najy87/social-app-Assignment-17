import { NextFunction, Request, Response, Router } from "express";
import commentService from "./comment.service";
import { Types } from "mongoose";
import { addReaction } from "../../common/service";
import { commentRepository } from "../../DB/models/comment/comment.repository";
const router = Router();
router.post(
  "/add-reaction",
  async (req: Request, res: Response, next: NextFunction) => {
    await addReaction(
      req.body,
      new Types.ObjectId("69e4f13ff1ad6cb0b554be40"),
      commentRepository,
    );
    return res.sendStatus(204);
  },
);

router.post(
  "/:postId{/:parentId}",
  async (req: Request, res: Response, next: NextFunction) => {
    await commentService.create(
      req.body,
      req.params,
      new Types.ObjectId("69e4f13ff1ad6cb0b554be40"),
    );
    return res.sendStatus(204);
  },
);

router.get(
  "/:postId{/:parentId}",
  async (req: Request, res: Response, next: NextFunction) => {
    const comments = await commentService.getAll(req.params);
    return res.status(200).json({ data: { comments } });
  },
);

export default router;
