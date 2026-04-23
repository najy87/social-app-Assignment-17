"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const post_repository_1 = require("./../../DB/models/post/post.repository");
const common_1 = require("../../common");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
class PostService {
    postRepository;
    userReactionRepository;
    constructor(postRepository, userReactionRepository) {
        this.postRepository = postRepository;
        this.userReactionRepository = userReactionRepository;
    }
    async create(createPostDTO, userId) {
        // repository >> create
        return await this.postRepository.create({ ...createPostDTO, userId });
    } /// body >> DTO
    async addReaction(addReactionDTO, userId) {
        // check post exiest
        const postExist = await this.postRepository.getOne({
            _id: addReactionDTO.postId,
        });
        if (!postExist)
            throw new common_1.NotFoundException("post not found");
        // check add reaction before
        const userReaction = await this.userReactionRepository.getOne({
            onModel: common_1.ON_MODEL.Post,
            refId: addReactionDTO.postId,
            userId,
        });
        // if no >> create
        if (!userReaction) {
            await this.userReactionRepository.create({
                onModel: common_1.ON_MODEL.Post,
                userId,
                refId: addReactionDTO.postId,
                reaction: addReactionDTO.reaction,
            });
            await this.postRepository.updateOne({ _id: addReactionDTO.postId }, { $inc: { reactionsCount: 1 } });
            return;
        }
        // if same reaction >> remove
        if (userReaction.reaction == addReactionDTO.reaction) {
            await this.userReactionRepository.deleteOne({
                _id: userReaction._id,
            });
            await this.postRepository.updateOne({ _id: addReactionDTO.postId }, { $inc: { reactionsCount: -1 } });
            return;
        }
        // if not same >> update
        await this.userReactionRepository.updateOne({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
        return;
    }
}
exports.PostService = PostService;
exports.default = new PostService(new post_repository_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository());
