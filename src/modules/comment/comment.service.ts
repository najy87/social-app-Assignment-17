import { CommentRepository } from "./../../DB/models/comment/comment.repository";
import { PostRepository } from "./../../DB/models/post/post.repository";
import { Types } from "mongoose";
import { CreateCommentDTO } from "./comment.dto";
import { NotFoundException } from "../../common";

class CommentSevice {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async create(
    createCommentDTO: CreateCommentDTO,
    params: any,
    userId: Types.ObjectId,
  ) {
    // check post existance
    const postExistance = await this.postRepository.getOne({
      _id: params.postId,
    });
    if (!postExistance) throw new NotFoundException("post not found ");
    if (params.parentId) {
      const parentCommentExist = await this.commentRepository.getOne({
        _id: params.parentId,
      });
      if (!parentCommentExist) {
        throw new NotFoundException("parent comment not found ");
      }
    }
    // if parentId >> reply >> check parent comment existence
    return await this.commentRepository.create({
      ...createCommentDTO,
      ...params,
      userId,
    });
  }

  async getAll(params: any) {
    const comments = await this.commentRepository.getAll({
      postId: params.postId,
      parentId: params.parentId,
    });
    if (!comments) throw new NotFoundException("no comments");
    return comments;
  }
}

export default new CommentSevice(new PostRepository(), new CommentRepository());
