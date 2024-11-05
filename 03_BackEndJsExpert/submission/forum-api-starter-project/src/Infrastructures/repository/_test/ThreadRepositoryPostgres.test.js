const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  let postingThread, fakeIdGenerator;
  beforeEach(() => {
    fakeIdGenerator = () => "12345"; // stub!
    postingThread = {
      title: "this is title",
      body: "this is body",
      owner: "user-123",
      username: "dicoding",
    };
    postingThreadComment = {
      threadId: "thread-123",
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

  describe("verifyThreadById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadById("thread-23212")
      ).rejects.toThrowError(new NotFoundError("data tidak ditemukan"));
    });
    it("should return nothing when thread found", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        ...postingThread,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadById("thread-123")
      ).resolves.not.toThrowError();
    });
  });

  describe("addThread function", () => {
    it("should persist add thread and return posting thread correctly", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        postingThread
      );

      // Assert
      expect(addedThread).toStrictEqual({
        id: "thread-12345",
        title: postingThread.title,
        owner: postingThread.owner,
      });
    });
  });

  describe("getThreadDetail function", () => {
    it("should persist get thread correctly", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });

      const getThread = await threadRepositoryPostgres.getThreadDetail({
        threadId: "thread-12345",
      });

      // Assert
      expect(getThread).toStrictEqual({
        id: "thread-12345",
        title: postingThread.title,
        body: postingThread.body,
        date: expect.any(Date),
        username: postingThread.username,
      });
    });
  });
});
