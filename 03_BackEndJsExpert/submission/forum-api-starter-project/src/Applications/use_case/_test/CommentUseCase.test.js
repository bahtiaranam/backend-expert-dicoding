const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  describe("executeAddComment", () => {
    it("should orchestrating the add thread comment action correctly", async () => {
      // Arrange
      const useCasePayload = {
        threadId: "thread-123",
        content: "sebuah body thread",
        username: "dicoding",
        owner: "user-123",
      };

      const mockAddComment = {
        id: "comment-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadById = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.addComment = jest
        .fn()
        .mockImplementation((comment) =>
          Promise.resolve({
            id: "comment-123",
            content: comment.content,
            owner: comment.owner,
          })
        );

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const postingComment = await commentUseCase.executeAddComment(
        useCasePayload
      );

      // Assert
      expect(mockThreadRepository.verifyThreadById).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.addComment).toBeCalledWith(useCasePayload);
      expect(postingComment).toEqual(mockAddComment);
    });
  });

  describe("executeDeleteComment", () => {
    it("should orchestrating the delete thread comment action correctly", async () => {
      // Arrange
      const useCasePayload = {
        threadId: "thread-123",
        commentId: "comment-12345",
        userId: "user-123",
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /** mocking needed function */
      mockCommentRepository.verifyCommentById = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.deleteCommentById = jest
        .fn()
        .mockImplementation(() => Promise.resolve("success"));

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const deleteComment = await commentUseCase.executeDeleteComment(
        useCasePayload
      );

      // Assert
      expect(mockCommentRepository.verifyCommentById).toBeCalledWith(
        useCasePayload.commentId
      );
      expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
        useCasePayload.userId,
        useCasePayload.commentId
      );
      expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
        useCasePayload
      );
      expect(deleteComment).toEqual("success");
    });
  });
});
