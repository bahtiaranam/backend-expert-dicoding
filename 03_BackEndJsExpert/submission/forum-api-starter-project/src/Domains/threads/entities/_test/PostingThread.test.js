const PostingThread = require("../PostingThread");

describe("a PostingThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      body: "ini sebuah body",
      username: "dicoding",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new PostingThread(payload)).toThrowError(
      "POSTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "Thread Title",
      body: 123,
      username: "dicoding",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new PostingThread(payload)).toThrowError(
      "POSTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create posting thread object correctly", () => {
    // Arrange
    const payload = {
      title: "Thread Title",
      body: "ini sebuah body",
      username: "dicoding",
      owner: "user-123",
    };

    // Action
    const postingThread = new PostingThread(payload);

    // Assert
    expect(postingThread.title).toEqual(payload.title);
    expect(postingThread.body).toEqual(payload.body);
    expect(postingThread.username).toEqual(payload.username);
    expect(postingThread.owner).toEqual(payload.owner);
  });
});
