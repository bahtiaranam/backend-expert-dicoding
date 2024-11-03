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

    const mockAddThread = {
      id: "thread-123",
      title: useCasePayload.title,
      body: useCasePayload.body,
      username: useCasePayload.username,
      owner: useCasePayload.owner,
    };

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
    expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload);
    expect(postingThread).toEqual({
      id: "thread-123",
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

    const mockGetThreadDetail = {
      id: "thread-123",
      title: "Title Thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    const mockGetThreadComments = [
      {
        id: "comment-123",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
      },
      {
        id: "comment-456",
        username: "dicoding",
        date: "2021-08-08T07:26:21.338Z",
        content: "komentar telah dihapus",
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetThreadDetail));
    mockThreadRepository.getThreadComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetThreadComments));

    /** creating use case instance */
    const getThreadDetailUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThreadDetail = await getThreadDetailUseCase.executeGetThreadDetail(
      useCasePayload
    );

    // Assert
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadComments).toBeCalledWith(
      useCasePayload
    );
    expect(getThreadDetail).toEqual({
      ...mockGetThreadDetail,
      comments: mockGetThreadComments,
    });
  });
});
