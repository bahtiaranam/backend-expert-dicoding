const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner, username } = request.auth.credentials;
    const { threadId } = request.params;

    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.executeAddComment({
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

  async deleteCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    await commentUseCase.executeDeleteComment({
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

module.exports = CommentsHandler;
