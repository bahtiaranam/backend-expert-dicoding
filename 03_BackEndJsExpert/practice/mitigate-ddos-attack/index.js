const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.Server({
    host: "localhost",
    port: 3000,
  });

  server.route({
    method: "GET",
    path: "/home",
    handler: (request, h) => {
      const remoteAddress = request.info.remoteAddress;
      if (remoteAddress === "127.0.0.1" || remoteAddress === "::1") {
        return h.response("You cant make request").code(403);
      }
      return h.response("Selamat Datang di Home").code(200);
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};
init();
