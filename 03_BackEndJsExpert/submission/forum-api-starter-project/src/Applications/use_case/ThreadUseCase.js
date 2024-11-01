const PostingThread = require("../../Domains/threads/entities/PostingThread");
const PostingThreadComment = require("../../Domains/threads/entities/PostingThreadComment");
const GetThreadDetail = require("../../Domains/threads/entities/GetThreadDetail");
const DeleteThreadComment = require("../../Domains/threads/entities/DeleteThreadComment");

class PostingThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async executeAddUser(useCasePayload) {
    const postingThread = new PostingThread(useCasePayload);
    return this._threadRepository.addThread(postingThread);
  }

  async executeAddThreadComment(useCasePayload) {
    const postingThreadComment = new PostingThreadComment(useCasePayload);
    await this._threadRepository.verifyThreadCommentById(
      postingThreadComment.threadId,
      "threads"
    );
    return this._threadRepository.addThreadComment(postingThreadComment);
  }

  async executeGetThreadDetail(useCasePayload) {
    const getThreadDetail = new GetThreadDetail(useCasePayload);
    return this._threadRepository.getThreadDetail(getThreadDetail);
  }

  async executeDeleteThreadComment(useCasePayload) {
    const deleteThreadComment = new DeleteThreadComment(useCasePayload);

    await this._threadRepository.verifyThreadCommentById(
      deleteThreadComment.commentId,
      "comments"
    );
    return this._threadRepository.deleteThreadCommentById(deleteThreadComment);
  }
}

module.exports = PostingThreadUseCase;
