import z from "zod";
import { BadRequestException, SYS_REACTION } from "../../common";
import { Types } from "mongoose";

// DTO >> data transfer object
export interface CreatePostDTO {
  // userId will be extracted from token
  content?: string;
  attatchment?: string[];
}

export const createPostSchema = z
  .object({
    content: z.string().optional(),
    attatchment: z.array(z.string()).optional(),
  })
  .refine((data) => {
    const { attatchment, content } = data;
    if (!content && (!attatchment || attatchment?.length == 0)) {
      throw new BadRequestException("content or attatchments must be provided");
    }
    return true;
  });

export interface AddReactionDTO {
  postId: Types.ObjectId;
  reaction: SYS_REACTION;
}
