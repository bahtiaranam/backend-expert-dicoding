const PostingComment = require("../../Domains/comments/entities/PostingComment");
const DeleteComment = require("../../Domains/comments/entities/DeleteComment");

class PostingCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async executeAddComment(useCasePayload) {
    const postingComment = new PostingComment(useCasePayload);
    await this._commentRepository.verifyCommentById(
      postingComment.threadId,
      "threads"
    );
    return this._commentRepository.addComment(postingComment);
  }

  async executeDeleteComment(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentRepository.verifyCommentById(
      deleteComment.commentId,
      "comments"
    );
    await this._commentRepository.verifyCommentOwner(
      deleteComment.userId,
      deleteComment.commentId
    );
    return this._commentRepository.deleteCommentById(deleteComment);
  }
}

module.exports = PostingCommentUseCase;
