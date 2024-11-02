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

  async getThreadDetail(payload) {
    const { threadId: thread_id } = payload;

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

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
