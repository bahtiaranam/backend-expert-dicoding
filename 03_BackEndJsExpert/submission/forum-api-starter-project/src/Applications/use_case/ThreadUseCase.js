const PostingThread = require("../../Domains/threads/entities/PostingThread");
const GetThreadDetail = require("../../Domains/threads/entities/GetThreadDetail");

class PostingThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async executeAddThread(useCasePayload) {
    const postingThread = new PostingThread(useCasePayload);
    return await this._threadRepository.addThread(postingThread);
  }

  async executeGetThreadDetail(useCasePayload) {
    const threadId = new GetThreadDetail(useCasePayload);
    const thread = await this._threadRepository.getThreadDetail(threadId);
    const comments = await this._commentRepository.getThreadComments(threadId);
    const parseComments = comments?.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: !comment.is_deleted
        ? comment.content
        : "**komentar telah dihapus**",
    }));
    return { ...thread, comments: parseComments };
  }
}

module.exports = PostingThreadUseCase;
