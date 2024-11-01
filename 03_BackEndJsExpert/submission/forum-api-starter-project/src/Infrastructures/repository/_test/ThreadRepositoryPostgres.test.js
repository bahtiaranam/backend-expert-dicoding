const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const PostingThread = require("../../../Domains/threads/entities/PostingThread");
const PostingThreadComment = require("../../../Domains/threads/entities/PostingThreadComment");
const GetThreadDetail = require("../../../Domains/threads/entities/GetThreadDetail");
const DeleteThreadComment = require("../../../Domains/threads/entities/DeleteThreadComment");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

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

  describe("verifyThreadCommentById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      await ThreadsTableTestHelper.verifyThreadCommentById(
        "thread-123",
        "threads"
      ); // memasukan user baru dengan username dicoding
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadCommentById(
          "thread-123",
          "threads"
        )
      ).rejects.toThrowError(NotFoundError);
    });
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
      const threads = await ThreadsTableTestHelper.verifyThreadCommentById(
        addedThread.id,
        "threads"
      );
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual("thread-12345");
      expect(threads[0].title).toEqual(postingThread.title);
      expect(threads[0].body).toEqual(postingThread.body);
      expect(threads[0].username).toEqual(postingThread.username);
      expect(threads[0].owner).toEqual(postingThread.owner);
    });
  });

  describe("addThreadComment function", () => {
    it("should persist add thread and return posting thread correctly", async () => {
      // Arrange
      const postingThread = new PostingThread(thread_payload);

      const postingThreadComment = new PostingThreadComment({
        threadId: "thread-12345",
        content: "this is content",
        username: "dicoding",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "12345"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(postingThread);
      const addedThreadComment =
        await threadRepositoryPostgres.addThreadComment(postingThreadComment);

      // Assert
      const threads = await ThreadsTableTestHelper.verifyThreadCommentById(
        addedThreadComment.id,
        "comments"
      );

      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual("comment-12345");
      expect(threads[0].content).toEqual(postingThreadComment.content);
      expect(threads[0].owner).toEqual(postingThreadComment.owner);
    });
  });

  describe("getThreadDetail function", () => {
    it("should persist add thread and return posting thread correctly", async () => {
      // Arrange
      const postingThread = new PostingThread(thread_payload);
      const postingThreadComment = new PostingThreadComment(
        thread_comment_payload
      );
      const payload = new GetThreadDetail({ threadId: "thread-12345" });

      const fakeIdGenerator = () => "12345"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(postingThread);
      await threadRepositoryPostgres.addThreadComment(postingThreadComment);
      await threadRepositoryPostgres.getThreadDetail(payload);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadDetail(payload);

      expect(threads.rows).toHaveLength(1);
      expect(threads.rows[0].id).toEqual("thread-12345");
    });
  });

  describe("deleteThreadCommentById function", () => {
    it("should persist add thread and return posting thread correctly", async () => {
      // Arrange
      const postingThread = new PostingThread(thread_payload);
      const postingThreadComment = new PostingThreadComment(
        thread_comment_payload
      );
      const payload = new DeleteThreadComment({
        threadId: "thread-12345",
        commentId: "comment-12345",
        userId: "user-12345",
      });

      const fakeIdGenerator = () => "12345"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(postingThread);
      await threadRepositoryPostgres.addThreadComment(postingThreadComment);

      await expect(
        threadRepositoryPostgres.deleteThreadCommentById(payload)
      ).rejects.toThrowError(
        new AuthorizationError(
          "Anda tidak memiliki hak akses untuk menghapus komentar ini"
        )
      );
    });

    it("should persist add thread and return posting thread correctly", async () => {
      // Arrange
      const postingThread = new PostingThread(thread_payload);
      const postingThreadComment = new PostingThreadComment(
        thread_comment_payload
      );
      const payload = new DeleteThreadComment({
        threadId: "thread-12345",
        commentId: "comment-12345",
        userId: "user-123",
      });

      const fakeIdGenerator = () => "12345"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await threadRepositoryPostgres.addThread(postingThread);
      await threadRepositoryPostgres.addThreadComment(postingThreadComment);

      // Action
      const deleteResult = await ThreadsTableTestHelper.deleteThreadCommentById(
        payload
      );

      expect(deleteResult.rowCount).toEqual(1);
      const comments = await ThreadsTableTestHelper.verifyThreadCommentById(
        "comment-12345",
        "comments"
      );
      expect(comments[0].is_deleted).toEqual(true);
    });
  });
});
