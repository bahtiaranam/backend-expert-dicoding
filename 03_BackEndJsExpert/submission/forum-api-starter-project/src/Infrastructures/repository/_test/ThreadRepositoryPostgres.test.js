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
      ).resolves.not.toThrowError(new NotFoundError("data tidak ditemukan"));
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
      const threadExist = await ThreadsTableTestHelper.verifyThreadById(
        "thread-12345"
      );

      // Assert
      expect(addedThread).toStrictEqual({
        id: "thread-12345",
        title: postingThread.title,
        owner: postingThread.owner,
      });
      expect(threadExist).toHaveLength(1);
      expect(threadExist[0].id).toEqual("thread-12345");
      expect(threadExist[0].title).toEqual(postingThread.title);
      expect(threadExist[0].body).toEqual(postingThread.body);
      expect(threadExist[0].username).toEqual(postingThread.username);
      expect(threadExist[0].owner).toEqual(postingThread.owner);
    });
  });

  describe("getThreadDetail function", () => {
    it("should persist get thread correctly", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await ThreadsTableTestHelper.addThread({
        id: "thread-12345",
        ...postingThread,
      });

      // Action
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
