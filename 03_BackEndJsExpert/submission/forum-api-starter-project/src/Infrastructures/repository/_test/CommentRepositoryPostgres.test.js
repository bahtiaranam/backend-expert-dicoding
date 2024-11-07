const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  let fakeIdGenerator;
  let postingThread, postingComment;
  let commentRepositoryPostgres;

  beforeEach(() => {
    fakeIdGenerator = () => "12345"; // stub!
    commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator
    );
    postingThread = {
      title: "this is title",
      body: "this is body",
      username: "dicoding",
      owner: "user-123",
    };
    postingComment = {
      threadId: "thread-12345",
      content: "this is content",
      username: "dicoding",
      owner: "user-123",
    };
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyCommentById function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        ...postingComment,
      });
      const commentRepositoryPostgresNotFound = new CommentRepositoryPostgres(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgresNotFound.verifyCommentById("comment-23212")
      ).rejects.toThrowError(new NotFoundError("data tidak ditemukan"));
    });
    it("should not return error notfound when comment exist", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        ...postingComment,
      });

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentById("comment-12345")
      ).resolves.not.toThrowError(new NotFoundError(`data tidak ditemukan`));
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should return AuthorizationError when userId and owner not match", async () => {
      // Action
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        ...postingComment,
      });
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          "user-123-random",
          "comment-12345"
        )
      ).rejects.toThrowError(
        new AuthorizationError(
          "Anda tidak memiliki hak akses untuk menghapus komentar ini"
        )
      );
    });

    it("should not return error when userId and owner match", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        ...postingComment,
      });
      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          "user-123",
          "comment-12345"
        )
      ).resolves.not.toThrowError(
        new AuthorizationError(
          "Anda tidak memiliki hak akses untuk menghapus komentar ini"
        )
      );
    });
  });

  describe("addComment function", () => {
    it("should persist add comment and return posting comment correctly", async () => {
      // Arange
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        postingComment
      );
      const verifyComment = await CommentsTableTestHelper.verifyCommentById(
        "comment-12345"
      );

      // Assert
      expect(addedComment).toEqual({
        id: "comment-12345",
        content: postingComment.content,
        owner: postingComment.owner,
      });

      expect(verifyComment).toHaveLength(1);
      expect(verifyComment[0].id).toEqual("comment-12345");
      expect(verifyComment[0].content).toEqual(postingComment.content);
      expect(verifyComment[0].owner).toEqual(postingComment.owner);
    });
  });

  describe("getThreadComments function", () => {
    it("should persist get thread comments correctly", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        ...postingComment,
      });

      // Action
      const getThreadComment =
        await commentRepositoryPostgres.getThreadComments({
          threadId: "thread-12345",
        });

      // Assert
      expect(getThreadComment).toMatchObject([
        {
          id: "comment-12345",
          username: postingComment.username,
          date: expect.any(Date),
          content: postingComment.content,
          is_deleted: false,
        },
      ]);
    });
  });

  describe("deleteCommentById function", () => {
    it("should persist delete comment success", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-12345",
        ...postingComment,
      });
      await CommentsTableTestHelper.verifyCommentOwner(
        "user-123",
        "comment-12345"
      );

      // Action
      const deleteThreadComment =
        await commentRepositoryPostgres.deleteCommentById({
          threadId: "thread-12345",
          commentId: "comment-12345",
        });
      const comments = await CommentsTableTestHelper.verifyCommentById(
        "comment-12345"
      );

      // Assert
      expect(deleteThreadComment).toBe("success");
      expect(comments[0].id).toEqual("comment-12345");
      expect(comments[0].thread_id).toEqual("thread-12345");
      expect(comments[0].is_deleted).toEqual(true);
    });
  });
});
