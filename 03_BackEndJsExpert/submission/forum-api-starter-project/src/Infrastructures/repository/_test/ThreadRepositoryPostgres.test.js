const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const PostingThread = require("../../../Domains/threads/entities/PostingThread");
const PostingComment = require("../../../Domains/comments/entities/PostingComment");
const GetThreadDetail = require("../../../Domains/threads/entities/GetThreadDetail");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
  let thread_payload, thread_comment_payload;
  beforeEach(() => {
    thread_payload = {
      title: "this is title",
      body: "this is body",
      username: "dicoding",
      owner: "user-123",
    };
    thread_comment_payload = {
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
      const postingThread = new PostingThread({
        title: "this is title",
        body: "this is body",
        username: "dicoding",
        owner: "user-123",
      });
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
      const postingThread = new PostingThread(thread_payload);
      const postingThreadComment = new PostingComment(thread_comment_payload);
      const payload = new GetThreadDetail({ threadId: "thread-12345" });

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
      await threadRepositoryPostgres.getThreadDetail(payload);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadDetail(payload);

      expect(threads.rows).toHaveLength(1);
      expect(threads.rows[0].id).toEqual("thread-12345");
    });
  });
});
