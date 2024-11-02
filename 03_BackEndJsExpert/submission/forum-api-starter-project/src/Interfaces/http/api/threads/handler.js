const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadCommentHandler = this.getThreadCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner, username } = request.auth.credentials;

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.executeAddThread({
      ...request.payload,
      username,
      owner,
    });

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadCommentHandler(request, h) {
    const { threadId } = request.params;

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread = await threadUseCase.executeGetThreadDetail({ threadId });

    const response = h.response({
      status: "success",
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
