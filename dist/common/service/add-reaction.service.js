"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReaction = void 0;
const user_reaction_repository_1 = require("./../../DB/models/user-reaction/user-reaction.repository");
const utils_1 = require("../utils");
const enums_1 = require("../enums");
function toModel(collectionName) {
    switch (collectionName) {
        case "posts":
            return enums_1.ON_MODEL.Post;
        case "comments":
            return enums_1.ON_MODEL.Comment;
        default:
            throw new utils_1.BadRequestException("invalid collection ");
    }
}
const addReaction = async (addReactionDTO, userId, repo) => {
    // check post exiest
    const docExist = await repo.getOne({
        _id: addReactionDTO.id,
    });
    if (!docExist)
        throw new utils_1.NotFoundException("post not found");
    const userReactionRepository = new user_reaction_repository_1.UserReactionRepository();
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
        await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: 1 } });
        return;
    }
    // if same reaction >> remove
    if (userReaction.reaction == addReactionDTO.reaction) {
        await userReactionRepository.deleteOne({
            _id: userReaction._id,
        });
        await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: -1 } });
        return;
    }
    // if not same >> update
    await userReactionRepository.updateOne({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
    return;
};
exports.addReaction = addReaction;
