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
    const getThreadDetail = new GetThreadDetail(useCasePayload);
    return this._threadRepository.getThreadDetail(getThreadDetail);
  }
}

module.exports = PostingThreadUseCase;
