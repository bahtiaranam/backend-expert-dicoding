const PostingThreadComment = require("../PostingThreadComment");

describe("a PostingThreadComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new PostingThreadComment(payload)).toThrowError(
      "POSTING_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new PostingThreadComment(payload)).toThrowError(
      "POSTING_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create posting thread comment object correctly", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
      content: "content",
      username: "dicoding",
      owner: "user-123",
    };

    // Action
    const postingThreadComment = new PostingThreadComment(payload);

    // Assert
    expect(postingThreadComment.threadId).toEqual(payload.threadId);
    expect(postingThreadComment.content).toEqual(payload.content);
    expect(postingThreadComment.username).toEqual(payload.username);
    expect(postingThreadComment.owner).toEqual(payload.owner);
  });
});
