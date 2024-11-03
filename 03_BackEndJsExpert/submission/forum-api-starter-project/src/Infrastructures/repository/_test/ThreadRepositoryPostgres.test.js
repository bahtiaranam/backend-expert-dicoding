const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const PostingThread = require("../../../Domains/threads/entities/PostingThread");
const PostingComment = require("../../../Domains/comments/entities/PostingComment");
const GetThreadDetail = require("../../../Domains/threads/entities/GetThreadDetail");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
  let postingThread, postingThreadComment;
  beforeEach(() => {
    postingThread = {
      title: "this is title",
      body: "this is body",
      owner: "user-123",
      username: "dicoding",
    };
    postingThreadComment = {
      threadId: "thread-12345",
      content: "this is content",
      username: "dicoding",
      owner: "user-123",
    };
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist add thread and return posting thread correctly", async () => {
      // Arrange
      const postThreadResponse = {
        id: "thread-12345",
        title: postingThread.title,
        owner: postingThread.owner,
      };
      const fakeIdGenerator = () => "12345"; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        postingThread
      );

      // Assert
      expect(addedThread).toStrictEqual(postThreadResponse);

      const threads = await CommentsTableTestHelper.verifyCommentById(
        addedThread.id,
        "threads"
      );
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual(addedThread.id);
      expect(threads[0].title).toEqual(postingThread.title);
      expect(threads[0].body).toEqual(postingThread.body);
      expect(threads[0].username).toEqual(postingThread.username);
      expect(threads[0].owner).toEqual(postingThread.owner);
    });
  });

  describe("getThreadDetail function", () => {
    it("should persist get thread correctly", async () => {
      // Arrange
      const payload = { threadId: "thread-12345" };

      const fakeIdGenerator = () => "12345"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(postingThread);
      await commentRepositoryPostgres.addComment(postingThreadComment);
      const getThread = await threadRepositoryPostgres.getThreadDetail(payload);

      // Assert
      expect(getThread).toStrictEqual({
        id: payload.threadId,
        title: postingThread.title,
        body: postingThread.body,
        date: getThread.date,
        username: postingThread.username,
      });

      const threads = await ThreadsTableTestHelper.getThreadDetail(payload);
      expect(threads.rows).toHaveLength(1);
      expect(threads.rows[0].id).toEqual("thread-12345");
      expect(threads.rows[0].title).toEqual(postingThread.title);
      expect(threads.rows[0].body).toEqual(postingThread.body);
      expect(threads.rows[0].username).toEqual(postingThread.username);
    });
  });
});
