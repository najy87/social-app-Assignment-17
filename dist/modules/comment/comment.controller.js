"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const mongoose_1 = require("mongoose");
const service_1 = require("../../common/service");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const router = (0, express_1.Router)();
router.post("/add-reaction", async (req, res, next) => {
    await (0, service_1.addReaction)(req.body, new mongoose_1.Types.ObjectId("69e4f13ff1ad6cb0b554be40"), comment_repository_1.commentRepository);
    return res.sendStatus(204);
});
router.post("/:postId{/:parentId}", async (req, res, next) => {
    await comment_service_1.default.create(req.body, req.params, new mongoose_1.Types.ObjectId("69e4f13ff1ad6cb0b554be40"));
    return res.sendStatus(204);
});
router.get("/:postId{/:parentId}", async (req, res, next) => {
    const comments = await comment_service_1.default.getAll(req.params);
    return res.status(200).json({ data: { comments } });
});
exports.default = router;
