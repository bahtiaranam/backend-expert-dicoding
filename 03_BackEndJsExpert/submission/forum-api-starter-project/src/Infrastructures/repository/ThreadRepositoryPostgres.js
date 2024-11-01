const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(postingThread) {
    const { title, body, username, owner } = postingThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, username, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyThreadCommentById(id, table) {
    const query = {
      text: `SELECT * FROM ${table} WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(`data tidak ditemukan`);
    }

    return true;
  }

  async addThreadComment(postingThreadComment) {
    const {
      threadId: thread_id,
      content,
      username,
      owner,
    } = postingThreadComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, thread_id, username, content, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadDetail(threadComment) {
    const { threadId: thread_id } = threadComment;

    const query = {
      text: `
        SELECT 
          threads.id,
          threads.title,
          threads.body,
          threads.date,
          threads.username,
          comments.id as comment_id,
          comments.username as comment_username,
          comments.date as comment_date,
          comments.content as comment_content,
          comments.is_deleted as comment_is_deleted
        FROM threads
        LEFT JOIN comments ON comments.thread_id = threads.id
        WHERE threads.id = $1
      `,
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    const thread = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].date,
      username: result.rows[0].username,
      comments: result.rows
        .filter((row) => row.comment_id !== null)
        .map((row) => ({
          id: row.comment_id,
          username: row.comment_username,
          date: row.comment_date,
          content: !row.comment_is_deleted
            ? row.comment_content
            : "**komentar telah dihapus**",
        })),
    };

    return thread;
  }

  async deleteThreadCommentById(deleteThreadComment) {
    const { threadId, commentId, userId } = deleteThreadComment;

    const verifyOwner = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const resultOwner = await this._pool.query(verifyOwner);
    if (resultOwner.rows[0].owner !== userId) {
      throw new AuthorizationError(
        "Anda tidak memiliki hak akses untuk menghapus komentar ini"
      );
    }

    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
