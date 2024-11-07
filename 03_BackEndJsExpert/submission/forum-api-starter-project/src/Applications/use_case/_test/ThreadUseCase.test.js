const ThreadUseCase = require("../ThreadUseCase");
const CommentUseCase = require("../CommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("ThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const addThreadPayload = {
      title: "Title Thread",
      body: "sebuah body thread",
      username: "dicoding",
      owner: "user-123",
    };
    const mockAddThread = {
      id: "thread-123",
      title: addThreadPayload.title,
      owner: addThreadPayload.owner,
    };

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation((thread) =>
      Promise.resolve({
        id: "thread-123",
        title: thread.title,
        owner: thread.owner,
      })
    );

    /** creating use case instance */
    const postingThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const postingThread = await postingThreadUseCase.executeAddThread(
      addThreadPayload
    );

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(addThreadPayload);
    expect(postingThread).toEqual(mockAddThread);
  });

  it("should orchestrating the get thread detail action correctly", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const addThreadPayload = {
      title: "Title Thread",
      body: "sebuah body thread",
      username: "dicoding",
      owner: "user-123",
    };
    const addCommentPayload = {
      threadId: "thread-123",
      content: "sebuah body thread",
      username: "dicoding",
      owner: "user-123",
    };
    const useCasePayload = {
      threadId: "thread-123",
    };

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation((thread) =>
      Promise.resolve({
        id: "thread-123",
        title: thread.title,
        owner: thread.owner,
      })
    );
    mockThreadRepository.verifyThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: "thread-123",
        title: addThreadPayload.title,
        body: addThreadPayload.body,
        date: new Date().toISOString(),
        username: addThreadPayload.username,
      })
    );
    mockCommentRepository.addComment = jest.fn().mockImplementation((comment) =>
      Promise.resolve({
        id: "comment-123",
        content: comment.content,
        owner: comment.owner,
      })
    );
    mockCommentRepository.verifyCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getThreadComments = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: "comment-123",
          username: addCommentPayload.username,
          date: new Date().toISOString(),
          content: addCommentPayload.content,
        },
      ])
    );

    // Action
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const commentUseCase = new CommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await threadUseCase.executeAddThread(addThreadPayload);
    await commentUseCase.executeAddComment(addCommentPayload);
    const getThreadDetail = await threadUseCase.executeGetThreadDetail(
      useCasePayload
    );

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(addThreadPayload);
    expect(mockThreadRepository.verifyThreadById).toBeCalled();
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.addComment).toBeCalledWith(addCommentPayload);
    expect(mockCommentRepository.getThreadComments).toBeCalledWith(
      useCasePayload
    );
    expect(getThreadDetail).toEqual({
      id: useCasePayload.threadId,
      title: addThreadPayload.title,
      body: addThreadPayload.body,
      date: expect.any(String),
      username: addThreadPayload.username,
      comments: [
        {
          id: "comment-123",
          username: addCommentPayload.username,
          date: expect.any(String),
          content: addCommentPayload.content,
        },
      ],
    });
  });

  it("should orchestrating the get thread detail action with is_deleted false", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const addThreadPayload = {
      title: "Title Threads",
      body: "sebuah body thread",
      username: "dicoding",
      owner: "user-123",
    };
    const addCommentPayload = {
      threadId: "thread-123",
      content: "sebuah body thread",
      owner: "user-123",
      username: "dicoding",
    };
    const useCasePayload = {
      threadId: "thread-123",
    };
    const deletePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation((thread) =>
      Promise.resolve({
        id: "thread-123",
        title: thread.title,
        owner: thread.owner,
      })
    );
    mockThreadRepository.verifyThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation((thread) =>
        Promise.resolve({
          id: thread.threadId,
          title: addThreadPayload.title,
          body: addThreadPayload.body,
          date: new Date().toISOString(),
          username: addThreadPayload.username,
        })
      );
    mockCommentRepository.addComment = jest.fn().mockImplementation((comment) =>
      Promise.resolve({
        thread: comment,
        id: comment.id,
        content: comment.content,
        owner: comment.owner,
      })
    );
    mockCommentRepository.verifyCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve("success"));
    mockCommentRepository.getThreadComments = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: "comment-123",
          username: addCommentPayload.username,
          date: new Date().toISOString(),
          content: addCommentPayload.content,
          is_deleted: true,
        },
      ])
    );

    // Action
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const commentUseCase = new CommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await threadUseCase.executeAddThread(addThreadPayload);
    await commentUseCase.executeAddComment(addCommentPayload);
    await commentUseCase.executeDeleteComment(deletePayload);
    const getThreadDetail = await threadUseCase.executeGetThreadDetail(
      useCasePayload
    );

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(addThreadPayload);
    expect(mockCommentRepository.addComment).toBeCalledWith(addCommentPayload);
    expect(mockCommentRepository.verifyCommentById).toBeCalledWith(
      "comment-123"
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      "user-123",
      "comment-123"
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      deletePayload
    );
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getThreadComments).toBeCalledWith(
      useCasePayload
    );
    expect(getThreadDetail).toEqual({
      id: useCasePayload.threadId,
      title: addThreadPayload.title,
      body: addThreadPayload.body,
      date: expect.any(String),
      username: addThreadPayload.username,
      comments: [
        {
          id: "comment-123",
          username: addCommentPayload.username,
          date: expect.any(String),
          content: "**komentar telah dihapus**",
        },
      ],
    });
  });
});
