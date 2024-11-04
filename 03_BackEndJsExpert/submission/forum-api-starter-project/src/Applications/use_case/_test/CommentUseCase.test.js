const CommentRepository = require("../../../Domains/comments/CommentRepository");
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
        owner: "user-123",
        username: "dicoding",
      };

      const mockAddComment = {
        id: "comment-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      };

      /** creating dependency of use case */
      const mockCommentRepository = new CommentRepository();

      /** mocking needed function */
      mockCommentRepository.verifyCommentById = jest
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
      const addCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
      });

      // Action
      const postingComment = await addCommentUseCase.executeAddComment(
        useCasePayload
      );

      // Assert
      expect(mockCommentRepository.addComment).toBeCalledWith(useCasePayload);
      expect(mockCommentRepository.verifyCommentById).toBeCalledWith(
        useCasePayload.threadId,
        "threads"
      );
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
        .mockImplementation((comment) => Promise.resolve(comment));

      /** creating use case instance */
      const deleteCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
      });

      // Action
      const deleteComment = await deleteCommentUseCase.executeDeleteComment(
        useCasePayload
      );

      // Assert
      expect(mockCommentRepository.verifyCommentById).toBeCalledWith(
        useCasePayload.commentId,
        "comments"
      );
      expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
        useCasePayload.userId,
        useCasePayload.commentId
      );
      expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
        useCasePayload
      );
      expect(deleteComment).not.toEqual(undefined); // receive return query result
    });
  });
});
