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
          content: row.comment_content,
        })),
    };

    return thread;
  }
}

module.exports = ThreadRepositoryPostgres;
