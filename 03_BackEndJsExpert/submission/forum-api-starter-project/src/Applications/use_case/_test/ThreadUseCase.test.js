const PostingThread = require("../../../Domains/threads/entities/PostingThread");
const PostingThreadComment = require("../../../Domains/threads/entities/PostingThreadComment");
const GetThreadDetail = require("../../../Domains/threads/entities/GetThreadDetail");
const DeleteThreadComment = require("../../../Domains/threads/entities/DeleteThreadComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadUseCase = require("../ThreadUseCase");
const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");

describe("ThreadUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "Title Thread",
      body: "sebuah body thread",
      username: "dicoding",
      owner: "user-123",
    };

    const mockAddThread = new PostingThread({
      id: "thread-123",
      title: useCasePayload.title,
      body: useCasePayload.body,
      username: useCasePayload.username,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddThread));

    /** creating use case instance */
    const addThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postingThread = await addThreadUseCase.executeAddUser(useCasePayload);

    // Assert
    expect(postingThread).toStrictEqual(
      new PostingThread({
        id: "thread-123",
        title: useCasePayload.title,
        body: useCasePayload.body,
        username: useCasePayload.username,
        owner: useCasePayload.owner,
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new PostingThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        username: useCasePayload.username,
        owner: useCasePayload.owner,
      })
    );
  });

  it("should orchestrating the add thread comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      content: "sebuah body thread",
      owner: "user-123",
    };

    const mockAddThreadComment = new PostingThreadComment({
      id: "comment-123",
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addThreadComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddThreadComment));

    /** creating use case instance */
    const addThreadCommentUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postingThreadComment =
      await addThreadCommentUseCase.executeAddThreadComment(useCasePayload);

    // Assert
    expect(postingThreadComment).toStrictEqual(
      new PostingThreadComment({
        id: "comment-123",
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );

    expect(mockThreadRepository.verifyThreadCommentById).toBeCalledWith(
      useCasePayload.threadId,
      "threads"
    );

    expect(mockThreadRepository.addThreadComment).toBeCalledWith(
      new PostingThreadComment({
        id: "comment-123",
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
  });

  // executeDeleteThreadComment
  it("should orchestrating the get thread detail action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    const mockGetThreadDetail = new GetThreadDetail({
      threadId: "thread-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetThreadDetail));

    /** creating use case instance */
    const getThreadDetailUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThreadDetail = await getThreadDetailUseCase.executeGetThreadDetail(
      useCasePayload
    );

    // Assert
    expect(getThreadDetail).toStrictEqual(
      new GetThreadDetail({
        threadId: "thread-123",
      })
    );

    expect(mockThreadRepository.getThreadDetail).toBeCalled();
  });

  it("should orchestrating the delete thread comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    const mockDeleteThreadComment = new DeleteThreadComment({
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteThreadCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDeleteThreadComment));

    /** creating use case instance */
    const deleteThreadCommentUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const deleteThreadComment =
      await deleteThreadCommentUseCase.executeDeleteThreadComment(
        useCasePayload
      );

    // Assert
    expect(deleteThreadComment).toStrictEqual(
      new DeleteThreadComment({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      })
    );

    expect(mockThreadRepository.verifyThreadCommentById).toBeCalledWith(
      useCasePayload.commentId,
      "comments"
    );

    expect(mockThreadRepository.deleteThreadCommentById).toBeCalled();
  });
});
