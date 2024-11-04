const ThreadUseCase = require("../ThreadUseCase");
const CommentUseCase = require("../CommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("ThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
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
    const addThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postingThread = await addThreadUseCase.executeAddThread(
      addThreadPayload
    );

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(addThreadPayload);
    expect(await postingThread).toEqual(mockAddThread);
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
      owner: "user-123",
      username: "dicoding",
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
    mockCommentRepository.verifyCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation((comment) =>
      Promise.resolve({
        id: comment.id,
        content: comment.content,
        owner: comment.owner,
      })
    );
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation((thread) =>
        Promise.resolve({
          id: thread.threadId,
          title: addThreadPayload.title,
          body: addThreadPayload.body,
          date: expect.any(String),
          username: addThreadPayload.username,
        })
      );
    mockThreadRepository.getThreadComments = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: "comment-123",
          username: addCommentPayload.username,
          date: expect.any(String),
          content: addCommentPayload.content,
        },
      ])
    );

    // Action
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const addCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await threadUseCase.executeAddThread(addThreadPayload);
    await addCommentUseCase.executeAddComment(addCommentPayload);
    const getThreadDetail = await threadUseCase.executeGetThreadDetail(
      useCasePayload
    );

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(addThreadPayload);
    expect(mockCommentRepository.addComment).toBeCalledWith(addCommentPayload);
    expect(mockCommentRepository.verifyCommentById).toBeCalled();
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadComments).toBeCalledWith(
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
});
