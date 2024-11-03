const PostingThread = require("../../Domains/threads/entities/PostingThread");
const GetThreadDetail = require("../../Domains/threads/entities/GetThreadDetail");

class PostingThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async executeAddThread(useCasePayload) {
    const postingThread = new PostingThread(useCasePayload);
    return await this._threadRepository.addThread(postingThread);
  }

  async executeGetThreadDetail(useCasePayload) {
    const threadId = new GetThreadDetail(useCasePayload);
    const thread = await this._threadRepository.getThreadDetail(threadId);
    const comments = await this._threadRepository.getThreadComments(threadId);
    return { ...thread, comments };
  }
}

module.exports = PostingThreadUseCase;
