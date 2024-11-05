/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async verifyThreadById(id) {
    const query = {
      text: `SELECT * FROM threads WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
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
        SELECT id, title, body, date, username FROM threads WHERE id = $1
      `,
      values: [thread_id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
