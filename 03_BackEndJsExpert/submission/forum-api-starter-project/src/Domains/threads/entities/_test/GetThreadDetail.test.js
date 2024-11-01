const GetThreadDetail = require("../GetThreadDetail");

describe("a GetThreadDetail entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new GetThreadDetail(payload)).toThrowError(
      "POSTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      threadId: 123,
    };

    // Action and Assert
    expect(() => new GetThreadDetail(payload)).toThrowError(
      "POSTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should get thread detail object correctly", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
    };

    // Action
    const getThreadId = new GetThreadDetail(payload);

    // Assert
    expect(getThreadId.threadId).toEqual(payload.threadId);
  });
});
