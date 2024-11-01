const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("/users endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads", () => {
    let server, loginUser, threadResponse, commentResponse;

    beforeEach(async () => {
      server = await createServer(container);
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });
      loginUser = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });
    });

    it("should response 201 and persisted thread", async () => {
      // Arrange
      const requestPayload = {
        title: "title",
        body: "this is body",
      };
      // eslint-disable-next-line no-undef

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${
            JSON.parse(loginUser.payload).data.accessToken
          }`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      threadResponse = responseJson.data.addedThread;
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should response 201 and persisted thread", async () => {
      // Arrange

      const requestPayload = {
        threadId: threadResponse.id,
        content: "this is content",
        username: "username",
        owner: threadResponse.owner,
      };
      // eslint-disable-next-line no-undef

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${
            JSON.parse(loginUser.payload).data.accessToken
          }`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      commentResponse = responseJson.data.addedComment;
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it("should response 201 and persisted thread", async () => {
      // Arrange
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.id}/comments/${commentResponse.id}`,
        headers: {
          Authorization: `Bearer ${
            JSON.parse(loginUser.payload).data.accessToken
          }`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 201 and persisted thread", async () => {
      // Arrange
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadResponse.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();

      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    });
  });
});
