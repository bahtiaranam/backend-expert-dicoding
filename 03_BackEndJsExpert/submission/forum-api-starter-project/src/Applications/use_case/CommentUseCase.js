const PostingComment = require("../../Domains/comments/entities/PostingComment");
const DeleteComment = require("../../Domains/comments/entities/DeleteComment");

class PostingCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async executeAddComment(useCasePayload) {
    const postingComment = new PostingComment(useCasePayload);
    await this._threadRepository.verifyThreadById(postingComment.threadId);
    return this._commentRepository.addComment(postingComment);
  }

  async executeDeleteComment(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentRepository.verifyCommentById(deleteComment.commentId);
    await this._commentRepository.verifyCommentOwner(
      deleteComment.userId,
      deleteComment.commentId
    );
    return this._commentRepository.deleteCommentById(deleteComment);
  }
}

module.exports = PostingCommentUseCase;
