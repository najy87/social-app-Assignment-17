import { Types } from "mongoose";

export interface CreateCommentDTO {
  content?: string;
  attatchment?: string;
  mentions?: Types.ObjectId[];
  // userId >> token medatory
  // postId >> params medatory
  // parentId >> params optional
}
