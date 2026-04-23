import { PostRepository } from "./../../DB/models/post/post.repository";
import { Types } from "mongoose";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { NotFoundException, ON_MODEL } from "../../common";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userReactionRepository: UserReactionRepository,
  ) {}
  async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
    // repository >> create
    return await this.postRepository.create({ ...createPostDTO, userId });
  } /// body >> DTO
  async addReaction(addReactionDTO: AddReactionDTO, userId: Types.ObjectId) {
    // check post exiest
    const postExist = await this.postRepository.getOne({
      _id: addReactionDTO.postId,
    });
    if (!postExist) throw new NotFoundException("post not found");

    // check add reaction before
    const userReaction = await this.userReactionRepository.getOne({
      onModel: ON_MODEL.Post,
      refId: addReactionDTO.postId,
      userId,
    });

    // if no >> create
    if (!userReaction) {
      await this.userReactionRepository.create({
        onModel: ON_MODEL.Post,
        userId,
        refId: addReactionDTO.postId,
        reaction: addReactionDTO.reaction,
      });

      await this.postRepository.updateOne(
        { _id: addReactionDTO.postId },
        { $inc: { reactionsCount: 1 } },
      );
      return;
    }

    // if same reaction >> remove
    if (userReaction.reaction == addReactionDTO.reaction) {
      await this.userReactionRepository.deleteOne({
        _id: userReaction._id,
      });
      await this.postRepository.updateOne(
        { _id: addReactionDTO.postId },
        { $inc: { reactionsCount: -1 } },
      );
      return;
    }

    // if not same >> update
    await this.userReactionRepository.updateOne(
      { _id: userReaction._id },
      { reaction: addReactionDTO.reaction },
    );
    return;
  }
}

export default new PostService(
  new PostRepository(),
  new UserReactionRepository(),
);
