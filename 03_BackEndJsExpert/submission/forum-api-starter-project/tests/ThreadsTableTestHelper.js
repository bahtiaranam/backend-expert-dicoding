/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({ id, title, body, username, owner }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, username, owner],
    };

    await pool.query(query);
  },

  async verifyThreadCommentById(id, table) {
    const query = {
      text: `SELECT * FROM ${table} WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addThreadComment({
    id,
    threadId: thread_id,
    username,
    content,
    owner,
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, thread_id, username, content, owner],
    };

    await pool.query(query);
  },

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

    return await pool.query(query);
  },

  async deleteThreadCommentById({ threadId, commentId, userId }) {
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
      text: "UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id = $2",
      values: [commentId, threadId],
    };

    return await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
