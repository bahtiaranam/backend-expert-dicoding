/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async verifyCommentById(id) {
    const query = {
      text: `SELECT * FROM comments WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addComment({ id, threadId: thread_id, username, content, owner }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, thread_id, username, content, owner],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await pool.query(query);
    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError(
        "Anda tidak memiliki hak akses untuk menghapus komentar ini"
      );
    }
  },

  async deleteCommentById({ threadId, commentId, userId }) {
    const verifyOwner = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const resultOwner = await pool.query(verifyOwner);
    if (resultOwner.rows[0].owner !== userId) {
      throw new AuthorizationError(
        "Anda tidak memiliki hak akses untuk menghapus komentar ini"
      );
    }

    const query = {
      text: "UPDATE comments SET is_deleted = true, content = '**komentar telah dihapus**' WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    return await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
