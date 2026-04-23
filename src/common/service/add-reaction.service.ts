import { UserReactionRepository } from "./../../DB/models/user-reaction/user-reaction.repository";
import { Types } from "mongoose";
import { AddReactionDTO } from "../dto";
import { BadRequestException, NotFoundException } from "../utils";
import { ON_MODEL } from "../enums";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CommentRepository } from "../../DB/models/comment/comment.repository";

function toModel(collectionName: string) {
  switch (collectionName) {
    case "posts":
      return ON_MODEL.Post;
    case "comments":
      return ON_MODEL.Comment;
    default:
      throw new BadRequestException("invalid collection ");
  }
}

export const addReaction = async (
  addReactionDTO: AddReactionDTO,
  userId: Types.ObjectId,
  repo: PostRepository | CommentRepository,
) => {
  // check post exiest
  const docExist = await repo.getOne({
    _id: addReactionDTO.id,
  });
  if (!docExist) throw new NotFoundException("post not found");

  const userReactionRepository = new UserReactionRepository();

  const collectionName = docExist.collection.name;

  // check add reaction before
  const userReaction = await userReactionRepository.getOne({
    onModel: toModel(collectionName),
    refId: addReactionDTO.id,
    userId,
  });

  // if no >> create
  if (!userReaction) {
    await userReactionRepository.create({
      onModel: toModel(collectionName),
      userId,
      refId: addReactionDTO.id,
      reaction: addReactionDTO.reaction,
    });

    await repo.updateOne(
      { _id: addReactionDTO.id },
      { $inc: { reactionsCount: 1 } },
    );
    return;
  }

  // if same reaction >> remove
  if (userReaction.reaction == addReactionDTO.reaction) {
    await userReactionRepository.deleteOne({
      _id: userReaction._id,
    });
    await repo.updateOne(
      { _id: addReactionDTO.id },
      { $inc: { reactionsCount: -1 } },
    );
    return;
  }

  // if not same >> update
  await userReactionRepository.updateOne(
    { _id: userReaction._id },
    { reaction: addReactionDTO.reaction },
  );
  return;
};
