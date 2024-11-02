const PostingThread = require("../../../Domains/threads/entities/PostingThread");
const PostingThreadComment = require("../../../Domains/comments/entities/PostingComment");
const GetThreadDetail = require("../../../Domains/threads/entities/GetThreadDetail");
const DeleteThreadComment = require("../../../Domains/comments/entities/DeleteComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadUseCase = require("../ThreadUseCase");

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
    const postingThread = await addThreadUseCase.executeAddThread(
      useCasePayload
    );

    // Assert
    expect(postingThread).toMatchObject({
      title: useCasePayload.title,
      body: useCasePayload.body,
      username: useCasePayload.username,
      owner: useCasePayload.owner,
    });

    expect(mockThreadRepository.addThread).toBeCalledWith({
      title: useCasePayload.title,
      body: useCasePayload.body,
      username: useCasePayload.username,
      owner: useCasePayload.owner,
    });
  });

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
});
