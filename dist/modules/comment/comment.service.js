"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_repository_1 = require("./../../DB/models/comment/comment.repository");
const post_repository_1 = require("./../../DB/models/post/post.repository");
const common_1 = require("../../common");
class CommentSevice {
    postRepository;
    commentRepository;
    constructor(postRepository, commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    async create(createCommentDTO, params, userId) {
        // check post existance
        const postExistance = await this.postRepository.getOne({
            _id: params.postId,
        });
        if (!postExistance)
            throw new common_1.NotFoundException("post not found ");
        if (params.parentId) {
            const parentCommentExist = await this.commentRepository.getOne({
                _id: params.parentId,
            });
            if (!parentCommentExist) {
                throw new common_1.NotFoundException("parent comment not found ");
            }
        }
        // if parentId >> reply >> check parent comment existence
        return await this.commentRepository.create({
            ...createCommentDTO,
            ...params,
            userId,
        });
    }
    async getAll(params) {
        const comments = await this.commentRepository.getAll({
            postId: params.postId,
            parentId: params.parentId,
        });
        if (!comments)
            throw new common_1.NotFoundException("no comments");
        return comments;
    }
}
exports.default = new CommentSevice(new post_repository_1.PostRepository(), new comment_repository_1.CommentRepository());
