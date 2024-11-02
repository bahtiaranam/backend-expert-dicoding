const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const PostingThread = require("../../../Domains/threads/entities/PostingThread");
const PostingComment = require("../../../Domains/comments/entities/PostingComment");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
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
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyCommentById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      await CommentsTableTestHelper.verifyCommentById("thread-123", "threads"); // memasukan user baru dengan username dicoding
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentById("thread-123", "threads")
      ).rejects.toThrowError(NotFoundError);
    });
    it("should return true when thread found", async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        postingThread
      );
      commentRepositoryPostgres.verifyCommentById(addedThread.id, "threads");
      const comments = await CommentsTableTestHelper.verifyCommentById(
        addedThread.id,
        "threads"
      ); // memasukan user baru dengan username dicoding

      // Action & Assert
      expect(comments).toHaveLength(1);
    });
  });

  describe("addComment function", () => {
    it("should persist add comment and return posting comment correctly", async () => {
      // Arrange
      const postingThread = new PostingThread(thread_payload);

      const postingThreadComment = new PostingComment({
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(postingThread);
      const addedComment = await commentRepositoryPostgres.addComment(
        postingThreadComment
      );

      // Assert
      const comments = await CommentsTableTestHelper.verifyCommentById(
        addedComment.id,
        "comments"
      );

      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual(addedComment.id);
      expect(comments[0].content).toEqual(postingThreadComment.content);
      expect(comments[0].owner).toEqual(postingThreadComment.owner);
    });
  });

  describe("deleteCommentById function", () => {
    it("should return AuthorizationError when userId and owner not match", async () => {
      // Arrange
      const postingThread = new PostingThread(thread_payload);
      const postingThreadComment = new PostingComment(thread_comment_payload);
      const payload = new DeleteComment({
        threadId: "thread-12345",
        commentId: "comment-12345",
        userId: "user-12345",
      });

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

      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          payload.userId,
          payload.commentId
        )
      ).rejects.toThrowError(
        new AuthorizationError(
          "Anda tidak memiliki hak akses untuk menghapus komentar ini"
        )
      );
    });

    it("should persist delete comment success", async () => {
      // Arrange
      const postingThread = new PostingThread(thread_payload);
      const postingThreadComment = new PostingComment(thread_comment_payload);
      const payload = new DeleteComment({
        threadId: "thread-12345",
        commentId: "comment-12345",
        userId: "user-123",
      });

      const fakeIdGenerator = () => "12345"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await threadRepositoryPostgres.addThread(postingThread);
      await commentRepositoryPostgres.addComment(postingThreadComment);

      // Action
      const deleteResult = await CommentsTableTestHelper.deleteCommentById(
        payload
      );

      expect(deleteResult.rowCount).toEqual(1);
      const comments = await CommentsTableTestHelper.verifyCommentById(
        "comment-12345",
        "comments"
      );
      expect(comments[0].is_deleted).toEqual(true);
    });
  });
});
