const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentById(id) {
    const query = {
      text: `SELECT * FROM comments WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(`data tidak ditemukan`);
    }
  }

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError(
        "Anda tidak memiliki hak akses untuk menghapus komentar ini"
      );
    }
  }

  async addComment(comment) {
    const { threadId: thread_id, content, username, owner } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, thread_id, username, content, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadComments(id) {
    const { threadId: thread_id } = id;

    const query = {
      text: `
        SELECT id, username, date, content, is_deleted FROM comments WHERE thread_id = $1 ORDER BY date ASC
      `,
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteCommentById(payload) {
    const { threadId, commentId } = payload;

    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    await this._pool.query(query);
    return "success";
  }
}

module.exports = CommentRepositoryPostgres;
