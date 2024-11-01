class PostingThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, username, owner } = payload;

    this.title = title;
    this.body = body;
    this.username = username;
    this.owner = owner;
  }

  _verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error("POSTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof title !== "string" || typeof body !== "string") {
      throw new Error("POSTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = PostingThread;
