const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const PostingThread = require("../../../Domains/threads/entities/PostingThread");
const PostingComment = require("../../../Domains/comments/entities/PostingComment");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  let fakeIdGenerator;
  let postingThread, postingComment, deleteComment;
  let threadRepositoryPostgres, commentRepositoryPostgres;
  beforeEach(() => {
    fakeIdGenerator = () => "12345"; // stub!
    threadRepositoryPostgres = new ThreadRepositoryPostgres(
      pool,
      fakeIdGenerator
    );
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
    deleteComment = {
      threadId: "thread-12345",
      commentId: "comment-12345",
      userId: "user-12345",
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
      await CommentsTableTestHelper.verifyCommentById("thread-123", "threads");
      const commentRepositoryPostgresNotFound = new CommentRepositoryPostgres(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgresNotFound.verifyCommentById(
          "thread-123",
          "threads"
        )
      ).rejects.toThrowError(NotFoundError);
    });
    it("should return true when thread found", async () => {
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        postingThread
      );
      const verifyThread = await commentRepositoryPostgres.verifyCommentById(
        addedThread.id,
        "threads"
      );
      const verifyThreadComment =
        await CommentsTableTestHelper.verifyCommentById(
          addedThread.id,
          "threads"
        );

      // Assert
      expect(verifyThread).toEqual({
        id: addedThread.id,
        date: verifyThread.date,
        ...postingThread,
      });
      expect(verifyThreadComment).toHaveLength(1);
      expect(verifyThreadComment[0].id).toEqual(addedThread.id);
      expect(verifyThreadComment[0].title).toEqual(postingThread.title);
      expect(verifyThreadComment[0].body).toEqual(postingThread.body);
      expect(verifyThreadComment[0].username).toEqual(postingThread.username);
      expect(verifyThreadComment[0].owner).toEqual(postingThread.owner);
    });
  });

  describe("addComment function", () => {
    it("should persist add comment and return posting comment correctly", async () => {
      // Arange
      const postingCommentResponse = {
        id: "comment-12345",
        content: postingComment.content,
        owner: postingComment.owner,
      };
      // Action
      await threadRepositoryPostgres.addThread(postingThread);
      const addedComment = await commentRepositoryPostgres.addComment(
        postingComment
      );
      const verifyComment = await CommentsTableTestHelper.verifyCommentById(
        addedComment.id,
        "comments"
      );

      // Assert
      expect(addedComment).toEqual(postingCommentResponse);
      expect(verifyComment).toHaveLength(1);
      expect(verifyComment[0].id).toEqual(postingCommentResponse.id);
      expect(verifyComment[0].content).toEqual(postingComment.content);
      expect(verifyComment[0].owner).toEqual(postingComment.owner);

      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should return AuthorizationError when userId and owner not match", async () => {
      // Action
      await threadRepositoryPostgres.addThread(postingThread);
      await commentRepositoryPostgres.addComment(postingComment);

      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          deleteComment.userId,
          deleteComment.commentId
        )
      ).rejects.toThrowError(
        new AuthorizationError(
          "Anda tidak memiliki hak akses untuk menghapus komentar ini"
        )
      );
    });

    it("should return owner when userId and owner match", async () => {
      // Arrange
      await threadRepositoryPostgres.addThread(postingThread);
      await commentRepositoryPostgres.addComment(postingComment);

      // Action
      const verifyOwner = await commentRepositoryPostgres.verifyCommentOwner(
        postingComment.owner,
        deleteComment.commentId
      );

      // Assert
      expect(verifyOwner).toEqual({ owner: postingComment.owner });
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });
  });

  describe("deleteCommentById function", () => {
    it("should persist delete comment success", async () => {
      // Arrange
      const payload = {
        threadId: "thread-12345",
        commentId: "comment-12345",
      };

      await threadRepositoryPostgres.addThread(postingThread);
      await commentRepositoryPostgres.addComment(postingComment);
      await commentRepositoryPostgres.verifyCommentOwner(
        postingComment.owner,
        deleteComment.commentId
      );

      // Action
      const deleteThreadComment =
        await commentRepositoryPostgres.deleteCommentById(payload);

      expect(deleteThreadComment.rowCount).toEqual(1);
      const comments = await CommentsTableTestHelper.verifyCommentById(
        payload.commentId,
        "comments"
      );
      expect(comments[0].id).toEqual(payload.commentId);
      expect(comments[0].thread_id).toEqual(payload.threadId);
      expect(comments[0].is_deleted).toEqual(true);
      expect(comments[0].content).toEqual("**komentar telah dihapus**");
    });
  });
});
