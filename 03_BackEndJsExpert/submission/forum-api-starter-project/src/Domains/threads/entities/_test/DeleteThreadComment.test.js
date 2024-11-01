const DeleteThreadComment = require("../DeleteThreadComment");

describe("a DeleteThreadComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
    };

    // Action and Assert
    expect(() => new DeleteThreadComment(payload)).toThrowError(
      "POSTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
      commentId: 123,
      userId: "user-123",
    };

    // Action and Assert
    expect(() => new DeleteThreadComment(payload)).toThrowError(
      "POSTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should delete thread comment object correctly", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    // Action
    const deleteThreadComment = new DeleteThreadComment(payload);

    // Assert
    expect(deleteThreadComment.threadId).toEqual(payload.threadId);
    expect(deleteThreadComment.commentId).toEqual(payload.commentId);
    expect(deleteThreadComment.userId).toEqual(payload.userId);
  });
});
