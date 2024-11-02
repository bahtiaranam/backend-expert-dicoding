class PostingComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, content, username, owner } = payload;

    this.threadId = threadId;
    this.content = content;
    this.username = username;
    this.owner = owner;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error("POSTING_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof content !== "string") {
      throw new Error(
        "POSTING_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

module.exports = PostingComment;
