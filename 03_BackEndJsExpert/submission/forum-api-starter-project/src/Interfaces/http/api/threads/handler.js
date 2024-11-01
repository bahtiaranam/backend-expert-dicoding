const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.getThreadCommentHandler = this.getThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler =
      this.deleteThreadCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner, username } = request.auth.credentials;

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.executeAddUser({
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

  async postThreadCommentHandler(request, h) {
    const { id: owner, username } = request.auth.credentials;
    const { threadId } = request.params;

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedComment = await threadUseCase.executeAddThreadComment({
      threadId,
      ...request.payload,
      username,
      owner,
    });

    const response = h.response({
      status: "success",
      data: {
        addedComment,
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

  async deleteThreadCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    await threadUseCase.executeDeleteThreadComment({
      threadId,
      commentId,
      userId,
    });

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
