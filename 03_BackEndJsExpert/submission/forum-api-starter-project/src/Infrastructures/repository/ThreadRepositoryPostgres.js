const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body, username, owner } = thread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, username, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadDetail(id) {
    const { threadId: thread_id } = id;

    const query = {
      text: `
        SELECT id, title, body, date, username FROM threads WHERE id = $1
      `,
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadComments(id) {
    const { threadId: thread_id } = id;

    const query = {
      text: `
        SELECT id, username, date, content FROM comments WHERE thread_id = $1 ORDER BY date ASC
      `,
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;
